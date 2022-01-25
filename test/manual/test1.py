import sys
print(sys.argv)

output_filename = "output-python.txt"
with open(output_filename, 'w+') as my_file:
    my_file.write('Some text for the next step.\n')
    my_file.write(sys.argv[1])
    my_file.close()

