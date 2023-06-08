#Image for matlan standalone app execution R2022b
FROM ubuntu:bionic-20230301

RUN apt-get -y update
RUN apt-get -y install wget
RUN apt-get -y install xserver-xorg-video-dummy x11-apps
RUN apt-get -y install unzip
RUN mkdir mlab
RUN wget https://ssd.mathworks.com/supportfiles/downloads/R2022b/Release/5/deployment_files/installer/complete/glnxa64/MATLAB_Runtime_R2022b_Update_5_glnxa64.zip
RUN unzip MATLAB_Runtime_R2022b_Update_5_glnxa64.zip -d mlab
RUN rm MATLAB_Runtime_R2022b_Update_5_glnxa64.zip
RUN mlab/install -agreeToLicense yes
