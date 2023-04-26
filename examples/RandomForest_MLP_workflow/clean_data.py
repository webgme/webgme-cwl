import pandas as pd
import sys

#command to execute the file is python clean_data; therefore, the input file is parsed in at sys.argv[1]
file_path = sys.argv[1]

#read the csv file
df = pd.read_csv(file_path, header=0)

#any required data cleaning
#in this example, we replace the species with target values.
df=df.replace('setosa','0')
df=df.replace('versicolor','1')
df=df.replace('virginica','2')
#save the cleaned data into file; this file name will be needed when we need to train the ML model
df.to_csv('cleaned_data.csv')


