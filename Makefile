VERSION=0.0.3
NOMBRE="huayra-tiempo"

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m

comandos:
	@echo ""
	@echo "${B}Comandos disponibles para ${G}huayra-tiempo${N}"
	@echo ""
	@echo "  ${Y}Para desarrolladores${N}"
	@echo ""
	@echo "    ${G}iniciar${N}         Instala dependencias."
	@echo "    ${G}compilar${N}        Genera los archivos compilados."
	@echo "    ${G}compilar_live${N}   Compila de forma contínua."
	@echo "    ${G}actualizar_css${N}  Instala/actualiza huayra-liso."
	@echo ""
	@echo "    ${G}ejecutar_linux${N}  Prueba la aplicacion sobre Huayra."
	@echo "    ${G}ejecutar_mac${N}    Prueba la aplicacion sobre OSX."
	@echo ""
	@echo "  ${Y}Para distribuir${N}"
	@echo ""
	@echo "    ${G}version${N}         Genera una nueva versión."
	@echo "    ${G}subir_version${N}   Sube version generada al servidor."
	@echo "    ${G}publicar${N}        Publica el cambio para el paquete deb."
	@echo "    ${G}crear_deb${N}       Genera el paquete deb para huayra."
	@echo ""


iniciar:
	npm install
	bower install

ejecutar_linux:
	nw dist

ejecutar_mac:
	/Applications/nwjs.app/Contents/MacOS/nwjs dist

actualizar_css:
	cp -r -f ../huayra-bootstrap-liso/destino/ public/huayra-liso
	rm public/huayra-liso/index.html

test_mac: ejecutar_mac

build: compilar

publicar:
	dch -i

crear_deb:
	dpkg-buildpackage -us -uc

compilar:
	./node_modules/ember-cli/bin/ember build

compilar_live:
	./node_modules/ember-cli/bin/ember build --watch

version:
	# patch || minor
	@bumpversion minor --current-version ${VERSION} package.json public/package.json Makefile app/templates/index.hbs --list
	make build
	@echo "Es recomendable escribir el comando que genera los tags y sube todo a github:"
	@echo ""
	@echo "make ver_sync"

subir_version:
	git commit -am 'release ${VERSION}'
	git tag '${VERSION}'
	git push
	git push --all
	git push --tags

.PHONY: dist
