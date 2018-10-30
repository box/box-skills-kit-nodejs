# Box Skills Kit Node.js SDK
Official SDK for writing Box Skills in Node.js

The Box Skills Kit SDK allows your application to receive and interpret event notifications from Box, retreive data from Box, and write to metadata in Box. 

The Box Skills Kit Node.js SDK contains two classes:
* The **Files Reader** class interprets incoming events from Box and can retrieve files from Box for processing
* The **Skills Writer** class writes data to a set of metadata templates in Box

Using these two classes, your application can retrieve files as they're uploaded to Box for processing and write the outputs of the processing to Box's metadata. This metadata information can be used to drive other Box functionality, such as search and preview.
