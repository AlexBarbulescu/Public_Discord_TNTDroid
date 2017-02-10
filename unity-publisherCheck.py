import dryscrape
import MySQLdb
import datetime
import unicodedata
import time 
import sys
import os
import re

start_time = time.time()

# python /var/www/TNTDroid/droid-Discord/unity-publisherCheck.py

if 'linux' in sys.platform:
    # start xvfb in case no X is running. Make sure xvfb 
    # is installed, otherwise this won't work!
    # os.environ['DISPLAY'] = ':9'
    dryscrape.start_xvfb()

# connects to database
db = MySQLdb.connect("localhost","root","diablo89","discord_bot")
cursor = db.cursor()

# args = sys.argsv
# args[0] = "infotoexecute"


# set up a web scraping session
sess = dryscrape.Session(base_url = 'https://www.assetstore.unity3d.com/en/')
sess.visit("https://www.assetstore.unity3d.com/en/#!/search/page=1/sortby=popularity/query=publisher:" + sys.argv[1])
# we don't need images
sess.set_attribute('auto_load_images', False)

email3 = sess.at_xpath(".//*[@id='contentaside']/div/span[3]/a")
email2 = sess.at_xpath(".//*[@id='contentaside']/div/span[2]/a")

if(email3 != None or email2 != None):

	if(email3 != None and re.match('mailto:', email3.get_attr('href'))):
		email3 = email3.get_attr('href').replace("mailto:", "")
		print('-- Email- ' + email3)
	elif(email2 != None and re.match('mailto:', email2.get_attr('href'))):
		email2 = email2.get_attr('href').replace("mailto:", "")
		print('-- Email- ' + email2)

else:
	print("-- Email not Verified")

print("-- Run Time - %s seconds ---" % (time.time() - start_time))