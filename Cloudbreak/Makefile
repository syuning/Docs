CB_BRANCH = $(shell echo \${BRANCH})
ifeq ($(CB_BRANCH),)
	CB_BRANCH=$(shell git name-rev --name-only HEAD) 
endif

CACHE = $(shell echo \${GRADLE_CACHE})
ifeq ($(CACHE),)
	CACHE_OPTION= 
else
	CACHE_OPTION=-v $(CACHE):/root/.gradle
endif

CB_LOCATION = $(shell echo \${CBLOC})
ifeq ($(CB_LOCATION),)
	CB_LOCATION = ../cloudbreak
endif

PW_PORT = $(shell echo \${PORT})
ifeq ($(PW_PORT),)
	PW_PORT = 8000
endif

PB_VER = "v3"

preview:
	 docker run --rm --name cloudbreak-documentation-preview -p $(PW_PORT):8000 -v $(PWD):/work hortonworks/pagebuilder:$(PB_VER) mkdocs serve

circleci:
	rm ~/.gitconfig

clean:
	rm -rf site

test:
	docker run --rm -p 8000:8000 -v $(PWD):/work hortonworks/pagebuilder:$(PB_VER) mkdocs build