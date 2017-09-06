#!/usr/bin/env python

import time
import threading
import signal
from RPi import GPIO
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

#GOAL DETECTION GPIOS
RED_LDR_PIN    = 4
RED_DIODE_PIN  = 17
BLUE_LDR_PIN   = 27
BLUE_DIODE_PIN = 22

_quit_event = threading.Event()

MIN_TIME_BETWEEN_GOALS_SEC = 3
_lastGoalTime = 0

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

def turnLedsOff(strip):
  for i in range(strip.numPixels()):
    strip.setPixelColor(i,Color(0,0,0))

  strip.show()

def goalDetected(channel):
  if (time.time() - _lastGoalTime < MIN_TIME_BETWEEN_GOALS_SEC):
    return

  # Timestamp time of this goal
  _lastGoalTime = time.time()

  if (channel == BLUE_LDR_PIN):
    print("Blue")
    theaterChase(strip, Color(0,0,127))
  else:
    print("Red")
    theaterChase(strip,Color(127,0,0))

  turnLedsOff(strip)

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

    input_thread = threading.Thread(target=handle_input_command, args=(_quit_event,))
    input_thread.daemon = True

    input_thread.start()

    GPIO.setmode(GPIO.BCM)

    GPIO.setup(BLUE_LDR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(BLUE_DIODE_PIN, GPIO.OUT)

    GPIO.setup(RED_LDR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(RED_DIODE_PIN, GPIO.OUT)

    GPIO.output(BLUE_DIODE_PIN, GPIO.HIGH)
    GPIO.output(RED_DIODE_PIN,  GPIO.HIGH)

    GPIO.add_event_detect(BLUE_LDR_PIN, GPIO.RISING, callback=goalDetected, bouncetime=3000)
    GPIO.add_event_detect(RED_LDR_PIN,  GPIO.RISING, callback=goalDetected, bouncetime=3000)

    _quit_event.wait()

    GPIO.remove_event_detect(BLUE_LDR_PIN)
    GPIO.remove_event_detect(RED_LDR_PIN)

    GPIO.output(BLUE_DIODE_PIN, GPIO.LOW)
    GPIO.output(RED_DIODE_PIN,  GPIO.LOW)

    GPIO.cleanup(BLUE_LDR_PIN)
    GPIO.cleanup(BLUE_DIODE_PIN)

    GPIO.cleanup(RED_LDR_PIN)
    GPIO.cleanup(RED_DIODE_PIN)


    # wait for other threads to quit and clean up before main can exit
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
