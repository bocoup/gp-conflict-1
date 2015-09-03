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
	src/data/sites.json \
	geo/region.shp

SYRIA_FILES = \
	geo/syria.shp \
	src/data/syria.json \
	geo/syriaCapital.shp \
	geo/syriaMajorCities.shp

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

src/data/sites.json: geo/idp.shp geo/camps.shp geo/crossings.shp geo/region.shp geo/syriaCapital.shp geo/syriaMajorCities.shp
	node_modules/.bin/topojson -p -o src/data/sites.json --width 600 --margin 20 \
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

# global

clean: clean_region clean_syria

all: $(REGION_FILES) $(SYRIA_FILES)

.PHONY: clean all