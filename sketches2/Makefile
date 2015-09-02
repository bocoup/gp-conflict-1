
GENERATED_FILES = \
	geo/idp.shp \
	geo/camps.shp \
	geo/crossings.shp \
	data/sites.json \
	geo/region.shp \
	geo/idp.shp \
	geo/camps.shp \
	geo/crossings.shp

all: $(GENERATED_FILES)

geo/region.shp:
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/region.shp ../Qgis/areas/SyriaRegion.shp
	# node_modules/.bin/topojson --properties name=NAME --width 600 --margin 20 --cartesian  -o region.json -- countries=region.shp

geo/idp.shp:
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/idp.shp ../../gp-conflict-1/data/geo/Syria_IDPSites_2015Apr16_HIU_USDoS/Syria_IDPSites_2015Apr16_HIU_USDoS.shp
	# node_modules/.bin/topojson --properties name=NAME --width 600 --margin 20 --cartesian  -o data/idp.json -- idps=geo/idp.shp

geo/camps.shp:
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/camps.shp ../../gp-conflict-1/data/geo/Syria_RefugeeSites_2015Apr16_HIU_USDoS/Syria_RefugeeSites_2015Apr16_HIU_USDoS.shp
	# node_modules/.bin/topojson --properties name=NAME,country=COUNTRY --width 600 --margin 20 --cartesian -o data/camps.json -- camps=geo/camps.shp

geo/crossings.shp:
	ogr2ogr -f 'ESRI Shapefile' -t_srs 'EPSG:4326' geo/crossings.shp ../../gp-conflict-1/data/geo/Syria_BorderCrossings_2015Apr16_HIU_USDoS/Syria_BorderCrossings_2015Apr16_HIU_USDoS.shp
	# node_modules/.bin/topojson --properties name=NAME --width 600 --margin 20 --cartesian  -o data/crossings.json -- crossings=geo/crossings.shp

data/sites.json: geo/idp.shp geo/camps.shp geo/crossings.shp geo/region.shp
	node_modules/.bin/topojson -p -o data/sites.json --width 600 --margin 20 --cartesian -- region=geo/region.shp camps=geo/camps.shp idp=geo/idp.shp crossings=geo/crossings.shp

clean:
	rm -f -- $(GENERATED_FILES)

.PHONY: clean all