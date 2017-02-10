import dryscrape
import MySQLdb
import datetime
import unicodedata
import time 
import sys
import os

start_time = time.time()

# args = sys.argv
# args[0] = "infotoexecute"

# python /var/www/TNTDroid/droid-Discord/test.py

if 'linux' in sys.platform:
    # start xvfb in case no X is running. Make sure xvfb 
    # is installed, otherwise this won't work!
    # os.environ['DISPLAY'] = ':10'
    dryscrape.start_xvfb()



# set up a web scraping session
sess = dryscrape.Session(base_url = 'https://www.assetstore.unity3d.com/en/')
sess.visit("https://www.assetstore.unity3d.com/en/#!/content/" + sys.argv[1])
# we don't need images
sess.set_attribute('auto_load_images', False)

# packageVerificationPre = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[4]/div/div/div[1]/span[5]/a').text()
# print packageVerificationPre

# time.sleep(5)

pharseTest = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[1]')

# print pharseTest

if(pharseTest != None):
	# packageVerification = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[1]/div').text()
	packageVerification = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[1]').get_attr('class')
	# print packageVerification

	if(packageVerification == "background"):
		print("-- Package is Verified")
	else:
		print("-- Package not Verified")

else:
	print("-- Page is blank.")


print("-- Run Time - %s seconds ---" % (time.time() - start_time))
