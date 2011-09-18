#!/usr/bin/env python
#Copyright Jon Berg , turtlemeat.com

import string,cgi,time
from os import curdir, sep
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
#import pri

class MyHandler(BaseHTTPRequestHandler):

  def do_GET(self):
    try:
      content = ''
      if self.path.endswith(".js"):
        mine = 'text/javascript'
        f = open(curdir + sep + self.path)
        content = f.read()
        f.close()
      elif self.path.endswith(".png"):
        mine = 'image/png'
        f = open(curdir + sep + self.path)
        content = f.read()
        f.close()        
      elif self.path.endswith(".html"):  
        mine = 'text/html'
        f = open(curdir + sep + self.path)
        content = f.read()
        f.close()
      else:
        mine = 'text/plain'
        content = 'Not supported %s' % self.path          
      self.send_response(200)
      self.send_header('Content-type',	mine)
      self.end_headers()
      self.wfile.write(content)
      return
            
    except IOError:
      self.send_error(404,'File Not Found: %s' % self.path)
   

  def do_POST(self):
    global rootnode
    try:
      ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
      if ctype == 'multipart/form-data':
          query=cgi.parse_multipart(self.rfile, pdict)
      self.send_response(301)
      
      self.end_headers()
      upfilecontent = query.get('upfile')
      print "filecontent", upfilecontent[0]
      self.wfile.write("<HTML>POST OK.<BR><BR>");
      self.wfile.write(upfilecontent[0]);
        
    except :
      pass

def main():
  try:
    # port must not be smaller than 1024
    server = HTTPServer(('', 8888), MyHandler)
    print 'started httpserver...'
    server.serve_forever()
  except KeyboardInterrupt:
    print '^C received, shutting down server'
    server.socket.close()

if __name__ == '__main__':
  main()

