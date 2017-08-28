#!/usr/bin/env python

import time
import threading
import signal

from gpiozero import LightSensor, OutputDevice

from neopixel import *


# LED strip configuration:
LED_COUNT      = 150      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
#LED_PIN        = 10      # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 5       # DMA channel to use for generating signal (try 5)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53
LED_STRIP      = ws.WS2811_STRIP_GRB   # Strip type and colour ordering


_quit_event = threading.Event()

# Define functions which animate LEDs in various ways.
def colorWipe(strip, color, wait_ms=50):
	"""Wipe color across display a pixel at a time."""
	for i in range(strip.numPixels()):
		strip.setPixelColor(i, color)
		strip.show()
		time.sleep(wait_ms/1000.0)

def theaterChase(strip, color, wait_ms=50, iterations=10):
	"""Movie theater light style chaser animation."""
	for j in range(iterations):
		for q in range(3):
			for i in range(0, strip.numPixels(), 3):
				strip.setPixelColor(i+q, color)
			strip.show()
			time.sleep(wait_ms/1000.0)
			for i in range(0, strip.numPixels(), 3):
				strip.setPixelColor(i+q, 0)

def wheel(pos):
	"""Generate rainbow colors across 0-255 positions."""
	if pos < 85:
		return Color(pos * 3, 255 - pos * 3, 0)
	elif pos < 170:
		pos -= 85
		return Color(255 - pos * 3, 0, pos * 3)
	else:
		pos -= 170
		return Color(0, pos * 3, 255 - pos * 3)

def rainbow(strip, wait_ms=20, iterations=1):
	"""Draw rainbow that fades across all pixels at once."""
	for j in range(256*iterations):
		for i in range(strip.numPixels()):
			strip.setPixelColor(i, wheel((i+j) & 255))
		strip.show()
		time.sleep(wait_ms/1000.0)

def rainbowCycle(strip, wait_ms=20, iterations=5):
	"""Draw rainbow that uniformly distributes itself across all pixels."""
	for j in range(256*iterations):
		for i in range(strip.numPixels()):
			strip.setPixelColor(i, wheel((int(i * 256 / strip.numPixels()) + j) & 255))
		strip.show()
		time.sleep(wait_ms/1000.0)

def theaterChaseRainbow(strip, wait_ms=50):
	"""Rainbow movie theater light style chaser animation."""
	for j in range(256):
		for q in range(3):
			for i in range(0, strip.numPixels(), 3):
				strip.setPixelColor(i+q, wheel((i+j) % 255))
			strip.show()
			time.sleep(wait_ms/1000.0)
			for i in range(0, strip.numPixels(), 3):
				strip.setPixelColor(i+q, 0)

def blueGoal(stop_event):
    #setup light sensor
    ldr = LightSensor(27,1)

    #setup laser diode
    diode = OutputDevice(6)
    diode.on()

    while not stop_event.is_set():
        if ldr.wait_for_dark(1):
            print("Blue")
            theaterChase(strip, Color(0,0,127))

    diode.off()
    ldr.close()

    print("blue  Done")

def redGoal(stop_event):
    #setup light sensor
    ldr = LightSensor(4,1)

    #setup laser diode
    diode = OutputDevice(17)
    diode.on()

    while not stop_event.is_set():
        if ldr.wait_for_dark(1):
            print("Red")
            theaterChase(strip,Color(127,0,0))

    diode.off()
    ldr.close()

    print("red  Done")

def exit_handler(signal, frame):
   print "Quiting!"
   _quit_event.set()

def handle_input_command(stop_event):
    while not stop_event.is_set():
        command = raw_input('')
        print command.lower()

        if command.lower() == "quit":
            _quit_event.set()

    print "input thread quiting"

def main():

    red = threading.Thread(target=redGoal, args=(_quit_event,))
    blue = threading.Thread(target=blueGoal, args=(_quit_event,))
    input_thread = threading.Thread(target=handle_input_command, args=(_quit_event,))
    input_thread.daemon = True

    red.start()
    blue.start()
    input_thread.start()

    _quit_event.wait()

    # wait for other threads to quit and clean up before main can exit
    red.join()
    blue.join()
    input_thread.join(2)
    print("Main Done")

#start process
if __name__ == '__main__':

    signal.signal(signal.SIGINT, exit_handler)

    # Create NeoPixel object with appropriate configuration.
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL, LED_STRIP)

    # Intialize the library (must be called once before other functions).
    strip.begin()

    main()
