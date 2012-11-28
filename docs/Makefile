all: design.png

%.png: %.dot
	dot -Tpng $< > $@

clean: 
	rm design.png design.dot
