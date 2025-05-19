#!/bin/bash 
set -ex

grep -c sedan renamed.csv
grep -c hatchback renamed.csv
grep -c SUV renamed.csv
grep -c Convertable renamed.csv
grep -c Station Wagon renamed.csv
grep -c Pickup renamed.csv
grep -c Van renamed.csv
grep -c 3dr renamed.csv