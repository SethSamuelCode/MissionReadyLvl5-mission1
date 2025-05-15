#!/bin/bash
cd ~/Desktop/dataset

for label in $(ls); do
echo $label | awk -F "_" '{print "gs://cars_raw/"$0","$1"_"$2"_" $3"," $16}' - >> ~/Desktop/googleTrainingList.csv
done