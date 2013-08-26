MOCHA_OPTS= --check-leaks
REPORTER = spec

check: test

test: clean-data data test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

data:
	mkdir ./data

clean-data:
	rm -fr ./data

.PHONY: test test-unit clean-data bin