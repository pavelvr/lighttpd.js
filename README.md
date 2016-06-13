# lighttpd.js

A really simple web server written in JavaScript to be ran with [node.js](http://nodejs.org/).

## Some features:

- Directory listing
- `index.html` as entry point for a directory (if present)
- Simple mimetype detection for some common filetypes
- Listen interface and port by parameter (defaults to 0.0.0.0:8082)
- About a hundred lines of code

## Running `lighttpd.js`
- There is a batch script for Windows systems (`runserver.cmd`). Just drag and drop a directory over the script, or
- From the command line, first change to the directory you wanna serve and then run the script, or
- On other systems, just run (`node lighttpd.js [port [interface]]`) from the command line (the directory to be serve is the current directory `.`)


## License

GPLv3+

## Contact

Pável Varela Rodríguez [neonskull@gmail.com](mailto:neonskull@gmail.com)
