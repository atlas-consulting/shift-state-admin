clean:
	rm -rf node_modules build
	cd server && rm -rf node_modules dist

from-scratch:
	make clean
	yarn
	cd server && yarn && cd ..
	yarn build

fresh-deps:
	yarn && cd server && yarn && cd ..

tests-run:
	yarn test

shift-state-run:
	yarn start


.PHONY: clean from-scratch