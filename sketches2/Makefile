
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
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/region.shp ../Qgis/areas/SyriaRegion.shp

geo/idp.shp:
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/idp.shp ../../gp-conflict-1/data/geo/Syria_IDPSites_2015Apr16_HIU_USDoS/Syria_IDPSites_2015Apr16_HIU_USDoS.shp

geo/camps.shp:
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/camps.shp ../../gp-conflict-1/data/geo/Syria_RefugeeSites_2015Apr16_HIU_USDoS/Syria_RefugeeSites_2015Apr16_HIU_USDoS.shp

geo/crossings.shp:
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/crossings.shp ../../gp-conflict-1/data/geo/Syria_BorderCrossings_2015Apr16_HIU_USDoS/Syria_BorderCrossings_2015Apr16_HIU_USDoS.shp

src/data/sites.json: geo/idp.shp geo/camps.shp geo/crossings.shp geo/region.shp
	node_modules/.bin/topojson -p -o src/data/sites.json --width 600 --margin 20 --cartesian -- region=geo/region.shp camps=geo/camps.shp idp=geo/idp.shp crossings=geo/crossings.shp

clean_region:
	rm -f -- $(REGION_FILES)

# Make Syria

geo/syria.shp:
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/syria.shp ../Qgis/areas/syria_shapefile/syria.geojson.shp

geo/syriaCapital.shp:
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/syriaCapital.shp ../Qgis/areas/SyriaCapital.shp

geo/syriaMajorCities.shp:
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/syriaMajorCities.shp ../Qgis/areas/SyriaCities.shp

src/data/syria.json: geo/syria.shp geo/syriaMajorCities.shp geo/syriaCapital.shp
	node_modules/.bin/topojson -p -o src/data/syria.json --width 516 --margin 9 --cartesian -- syria=geo/syria.shp capital=geo/syriaCapital.shp cities=geo/syriaMajorCities.shp

clean_syria:
	rm -f -- $(SYRIA_FILES)

# global

clean: clean_region clean_syria

all: $(REGION_FILES) $(SYRIA_FILES)

.PHONY: clean all