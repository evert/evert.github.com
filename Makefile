JEKYLL_VERSION=3.8

watch:
	docker run --rm \
	--volume="$(PWD):/srv/jekyll" \
	-p 4000:4000 \
    	-it jekyll/jekyll:${JEKYLL_VERSION} \
    	jekyll serve --watch --future
