
library('dplyr')
library('reshape2')
library('ggthemes')
library('ggplot2')

# I should be able to just read the CSV like this:
#data <- read.csv("~/Desktop/syrian-refugee-counts.csv", stringsAsFactors = FALSE)

# But there is some weird strings in some of the coulmns - that convert all the values
# in that column into strings!!!
# - so I end up using this read.table a lot - which is just the more tunable version
#   of read.csv. Here I pass in all the strings that should count as 'NA' - so it 
#   reads the numbers right.
# - A terrible limitation (IMO) of trying to share R code is paths.
#   So here I'm just using a full path to the data file. You would need to change this
data <- read.table("~/Desktop/syrian-refugee-counts.csv", header = TRUE, sep = ",", as.is = TRUE, na.strings = c("NA", "", "*"))

# k. i don't usually do this - but i want to store all my plots in a list so I can print them at the end. 
# so here is a list to store them.
plots <- list()


## ASIDE: Data assumptions and hack cleaning

# I didn't do this before I started - but then saw some weirdness in the data. 
# My assumption was that there is a single line in the CSV file for every destination, for every year
# BUT THAT's NOT TRUE!
dest_year_counts <- data %>% group_by(Destination, Year) %>% summarize( count = n())
doubles <- dest_year_counts %>% filter(count > 1)

# there are 3 destination / year combo's where there are 2 rows.
bad_data <- data %>% filter(Destination %in% doubles$Destination & Year %in% doubles$Year)

# ok. it looks like these rows only have "Others" populated. Are there any other rows with "Others"?
other_data <- data %>% filter(!is.na(Others))
# boo there are. Ok. I'm just going to filter out these 3 'others' for now.

data <- data %>% filter(!(Destination %in% doubles$Destination & Year %in% doubles$Year & !is.na(Others)))


# Now I convert all those NA's to zeros. Often this is a bad idea - but for here,
# I think missing data and 0 are probably the same thing.
data[is.na(data)] <- 0


# Now we start using dplyr! 
# mutate will add a new column to our existing data
# note the functional style chaining using %>%. 
# - Its ugly! but you get used to it. This passes data as the first
#  parameter of mutate. Makes it easy to add more modifications to the chain
#  as we will see soon.
data <- data %>% mutate(TotalRefugees = Refugees + AsylumSeekers)

# you could also write it like this: 
#  data %>% mutate(TotalRefugees = Refugees + AsylumSeekers) -> data
# (i think)  - but I never use that style

# This is ggplot2 code. I use the same basic pattern each time. 
# tell it what data to use, and which data map to which visual dimensions
# then say how to represent the data (here we are making a scatter plot - so point)
p <- ggplot(data, aes(x = Year, y = TotalRefugees))
p <- p + geom_point() + labs(title="Refugees by Year")
p

plots <- list(plots, list(p))

# more dplyr. We use group_by and then summarise to sum all TotalRefugees by year.
# so by_year will contain JUST Year, count, and Total columns
# and the Total will be the total for each year.
by_year <- data %>% group_by(Year) %>% summarise(count = n(), Total = sum(TotalRefugees))

# make a barchart of that. geom_bar wants to use raw counts for a Y value
# so you have to remember to pass in the 'identity' for the stat - so you
# can specify the Y value. 
p <- ggplot(by_year, aes(x = Year, y = Total))
p <- p + geom_bar(stat='identity')
p

plots <- list(plots, list(p))

# same group_by dplyr use - but by Destination now. Also, we add an arrange - to sort the rows
by_dest <- data %>% group_by(Destination) %>% summarise(count = n(), Total = sum(TotalRefugees)) %>% arrange(-Total)

# then we slice off the top 20. REMEMBER - R indexes start at 1 . 
top_dest <- by_dest %>% slice(1:20)


# Here is a barplot of this. Unfortunately, I haven't ever figured out how to get ggplot to honor the 
# order of the data presented. Instead, it wants to sort by Alphabetical order.
# So, for the x dimension - i create a factor with an explicit order - using levels = -- and set that
# order to be the order of the Destinations. Confusing i know. I hope some day there will be an easier way
p <- ggplot(top_dest, aes(x = factor(Destination, levels = rev(top_dest$Destination)), y = Total))
p <- p + geom_bar(stat='identity') + coord_flip() + labs(x = "Destination", title = "Top Destinations (all data)")
p

plots <- list(plots, list(p))

# pull out just data from just 2011 and on
recent_data <- data %>% filter(Year > 2010)
# do the same group_by for destinations on just this subset of data
recent_dest <- recent_data %>% group_by(Destination) %>% summarise(count = n(), Total = sum(TotalRefugees)) %>% arrange(-Total)
top_recent_dest <- recent_dest %>% slice(1:20)

# graph as a barchart
p <- ggplot(top_recent_dest, aes(x = factor(Destination, levels = rev(top_recent_dest$Destination)), y = Total))
p <- p + geom_bar(stat='identity') + coord_flip() + labs(x = "Destination", title = "Top Destinations (Year > 2010)")
p

plots <- list(plots, list(p))

# So we have our list of top destinations. Do they follow the same pattern across the years? 
# Lets look by plotting small multiples!

# Now pull out just the data of the countries in the this 'top 20' list. The filter by a list using %in%
# is a good thing to remember.
top_recent_data <- recent_data %>% filter(Destination %in% top_recent_dest$Destination)

# plot this as a small multiple. We use facet_wrap to split up the data by Destination
# (you give it a formula for what to facet on - and I always have to look up the syntax)
#  - you can also see that it is reverting to sorting these in alphabetical order again. come on ggplot!
p <- ggplot(top_recent_data, aes(x = Year, y = TotalRefugees))
p <- p + geom_bar(stat = 'identity') + facet_wrap(~ Destination) + labs(title = "Top Recent Destinations by Country")
p

plots <- list(plots, list(p))

# filter off just the top 10
top_ten_dest <- top_recent_dest %>% slice(1:10)
top_ten_data <- recent_data %>% filter(Destination %in% top_ten_dest$Destination) %>% arrange(Year, -TotalRefugees)

# line plot
p <- ggplot(top_ten_data, aes(x = Year, y = TotalRefugees, color = Destination))
p <- p + geom_line(size = 2)
p
plots <- list(plots, list(p))

# this is what made be go back and check my data assumptions - there were 2 rows for Lebanon.
#data %>% filter(Destination == "Lebanon", Year == 2014)

# stacked barchart. Stupid thing doesn't sort properly. Havent' figured out how to fix it completely yet.
p <- ggplot(top_ten_data, aes(x = Year, y = TotalRefugees, fill = factor(Destination, levels = top_ten_dest$Destination) ))
p <- p + geom_bar(stat='identity') + labs(fill = "")
p
plots <- list(plots, list(p))

# Finally, here is some stupid code that should print out all my plots into a file called 'all.pdf'
# from: http://stackoverflow.com/questions/20500706/saving-multiple-ggplots-from-ls-into-one-and-seperate-files-in-r
pdf("all.pdf")
bquiet = lapply(plots, print)
dev.off()
