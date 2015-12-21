CC=gcc
CFLAGS=-c -Wall
LDFLAGS=
SOURCES=wrapper.cpp algo.cpp
OBJECTS=$(SOURCES:.cpp=.o)
EXECUTABLE=algo

all: $(SOURCES) $(EXECUTABLE)

$(EXECUTABLE): $(OBJECTS)
    $(CC) $(LDFLAGS) $(OBJECTS) -o $@

.cpp.o:
    $(CC) $(CFLAGS) $< -o $@