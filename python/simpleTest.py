#!/usr/bin/env python

import time, sys, threading, signal

from random import randint


_quit_event = threading.Event()

def blueGoal(stop_event):
    while not stop_event.is_set():
        stop_event.wait(timeout=randint(1,10))
        print "Blue"
        sys.stdout.flush()


    print "blue  Done"

def redGoal(stop_event):

    while not stop_event.is_set():
        stop_event.wait(timeout=randint(1,10))
        print("Red")
        sys.stdout.flush()

    print("Red  Done")

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
    print "hello!"
    sys.stdout.flush()
    time.sleep(3)
    _quit_event.set()
    #_quit_event.wait();

    # wait for other threads to quit and clean up before main can exit
    red.join()
    blue.join()
    input_thread.join(2)
    print("Main Done")


#start process
if __name__ == '__main__':

    main()