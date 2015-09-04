# To make the files, make sure you point to the folder
# containinig the source Geo.
# for example:
# GEODIR="/Users/iros/Dropbox (Bocoup)/dev/global-post/conflict-1/geo"
# Geo source is found here:
# https://www.dropbox.com/sh/76wsiew1hwkjrba/AADuUllz5kR0AWshi8wHUIFfa?dl=0

PROJECTION = "http://spatialreference.org/ref/epsg/4326/"

REGION_FILES = \
	geo/idp.shp \
	geo/camps.shp \
	geo/crossings.shp \
	src/data/region.json \
	geo/region.shp

SYRIA_FILES = \
	geo/syria.shp \
	src/data/syria.json \
	geo/syriaCapital.shp \
	geo/syriaMajorCities.shp

GERMANY_FILES = \
	geo/germany.shp \
	src/data/germany.json \
	geo/germanyCapital.shp \
	geo/germanyMajorCities.shp

LEBANON_FILES = \
	geo/lebanon.shp \
	src/data/lebanon.json \
	geo/lebanonCapital.shp \
	geo/lebanonMajorCities.shp

TURKEY_FILES = \
	geo/turkey.shp \
	src/data/turkey.json \
	geo/turkeyCapital.shp \
	geo/turkeyMajorCities.shp

# Make region
geo/region.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/region.shp \
		"${GEODIR}/unzipped/Syria/SyriaRegion/SyriaRegion.shp"

geo/idp.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/idp.shp \
		"${GEODIR}/unzipped/Syria/IDPCamps/Syria_IDPSites_2015Apr16_HIU_USDoS.shp"

geo/camps.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/camps.shp \
		"${GEODIR}/unzipped/Syria/RefugeeCamps/Syria_RefugeeSites_2015Apr16_HIU_USDoS.shp"

geo/crossings.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/crossings.shp \
		"${GEODIR}/unzipped/Syria/BorderCrossings/Syria_BorderCrossings_2015Apr16_HIU_USDoS.shp"

src/data/region.json: geo/idp.shp geo/camps.shp geo/crossings.shp geo/region.shp geo/syriaCapital.shp geo/syriaMajorCities.shp
	node_modules/.bin/topojson -p -o src/data/region.json --width 600 --margin 20 \
		--cartesian -- region=geo/region.shp camps=geo/camps.shp idp=geo/idp.shp \
		crossings=geo/crossings.shp capital=geo/syriaCapital.shp \
		cities=geo/syriaMajorCities.shp

clean_region:
	rm -f -- $(REGION_FILES)

# Make Syria
geo/syria.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/syria.shp \
		"${GEODIR}/unzipped/Syria/SyriaOnly/syria.geojson.shp"

geo/syriaCapital.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/syriaCapital.shp \
		"${GEODIR}/unzipped/Syria/SyriaCapital/SyriaCapital.shp"

geo/syriaMajorCities.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/syriaMajorCities.shp \
		"${GEODIR}/unzipped/Syria/SyriaCities/SyriaCities.shp"

src/data/syria.json: geo/syria.shp geo/syriaMajorCities.shp geo/syriaCapital.shp
	node_modules/.bin/topojson -p -o src/data/syria.json --width 516 --margin 9 \
		--cartesian -- syria=geo/syria.shp capital=geo/syriaCapital.shp \
		cities=geo/syriaMajorCities.shp

clean_syria:
	rm -f -- $(SYRIA_FILES)

# Make Germany
geo/germany.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/germany.shp \
		"${GEODIR}/unzipped/Germany/GermanyOnly/GermanyOnly.shp"

geo/germanyCapital.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/germanyCapital.shp \
		"${GEODIR}/unzipped/Germany/GermanyCapital/GermanyCapital.shp"

geo/germanyMajorCities.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/germanyMajorCities.shp \
		"${GEODIR}/unzipped/Germany/GermanyMajorCities/GermanyMajorCities.shp"

src/data/germany.json: geo/germany.shp geo/germanyMajorCities.shp geo/germanyCapital.shp
	node_modules/.bin/topojson -p -o src/data/germany.json --width 105 --margin 9 \
		--cartesian -- germany=geo/germany.shp capital=geo/germanyCapital.shp \
		cities=geo/germanyMajorCities.shp

clean_germany:
	rm -f -- $(GERMANY_FILES)

# Make Lebanon
geo/lebanon.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/lebanon.shp \
		"${GEODIR}/unzipped/Lebanon/LebanonOnly/LebanonOnly.shp"

geo/lebanonCapital.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/lebanonCapital.shp \
		"${GEODIR}/unzipped/Lebanon/LebanonCapital/LebanonCapital.shp"

geo/lebanonMajorCities.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/lebanonMajorCities.shp \
		"${GEODIR}/unzipped/Lebanon/LebanonMajorCities/LebanonMajorCities.shp"

src/data/lebanon.json: geo/lebanon.shp geo/lebanonMajorCities.shp geo/lebanonCapital.shp
	node_modules/.bin/topojson -p -o src/data/lebanon.json --width 25 --margin 9 \
		--cartesian -- lebanon=geo/lebanon.shp capital=geo/lebanonCapital.shp \
		cities=geo/lebanonMajorCities.shp

clean_lebanon:
	rm -f -- $(LEBANON_FILES)

# Make Turkey
geo/turkey.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/turkey.shp \
		"${GEODIR}/unzipped/Turkey/TurkeyOnly/TurkeyOnly.shp"

geo/turkeyCapital.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/turkeyCapital.shp \
		"${GEODIR}/unzipped/Turkey/TurkeyCapital/TurkeyCapital.shp"

geo/turkeyMajorCities.shp:
	ogr2ogr -f 'ESRI Shapefile' -a_srs ${PROJECTION} geo/turkeyMajorCities.shp \
		"${GEODIR}/unzipped/Turkey/TurkeyMajorCities/TurkeyMajorCities.shp"

src/data/turkey.json: geo/turkey.shp geo/turkeyMajorCities.shp geo/turkeyCapital.shp
	node_modules/.bin/topojson -p -o src/data/turkey.json --width 135 --margin 9 \
		--cartesian -- turkey=geo/turkey.shp capital=geo/turkeyCapital.shp \
		cities=geo/turkeyMajorCities.shp

clean_turkey:
	rm -f -- $(TURKEY_FILES)

# global
clean: clean_region clean_syria clean_germany clean_lebanon clean_turkey

all: $(REGION_FILES) $(SYRIA_FILES) $(GERMANY_FILES) $(LEBANON_FILES) $(TURKEY_FILES)

.PHONY: clean all