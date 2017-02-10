import dryscrape
import MySQLdb
import datetime
import unicodedata
import time 
import sys
import os

start_time = time.time()

# sudo apt-get install qt5-default libqt5webkit5-dev build-essential \ python-lxml python-pip xvfb
# sudo apt-get install python-lxml python-pip xvfb

# python /var/www/TNTDroid/droid-Discord/unity-24hParsing.py
if 'linux' in sys.platform:
    # start xvfb in case no X is running. Make sure xvfb 
    # is installed, otherwise this won't work!
    # os.environ['DISPLAY'] = ':1'
    dryscrape.start_xvfb()

# connects to database
db = MySQLdb.connect("localhost","root","diablo89","discord_bot")
cursor = db.cursor()

# set up a web scraping session
sess = dryscrape.Session(base_url = 'https://www.assetstore.unity3d.com/en/')
sess.visit('https://www.assetstore.unity3d.com/en/')
# we don't need images
sess.set_attribute('auto_load_images', False)
sess.set_attribute('accelerated_compositing_enabled', True)


# time.sleep(5)

# pharseTest = sess.at_xpath('/html/body/div[2]/div[2]/div/section[2]/div[2]/a/div/div[2]/h3')
pharseTest = sess.at_xpath('/html')


# Selects the last link from the table
cursor.execute("SELECT packageName FROM rssDiscounted ORDER BY id DESC LIMIT 1")
db.commit()

# checks if the mysql has a row inserted, if not is blank
if cursor.rowcount == 0:
	dbPackageName = ""
else:
	dbPackageName = cursor.fetchone()[0]

if(pharseTest != None):

	pharseNameTest = sess.at_xpath('/html/body/div[2]/div[2]/div/section[2]/div[2]/a/div/div[2]/h3')

	if(pharseNameTest != None):
		pharseName = sess.at_xpath('/html/body/div[2]/div[2]/div/section[2]/div[2]/a/div/div[2]/h3').text()
		pharseLink = sess.at_xpath('/html/body/div[2]/div[2]/div/section[2]/div[2]/a').get_attr('href')

		pharseName = unicodedata.normalize('NFKD', pharseName).encode('ascii','ignore').replace("(", "").replace(")", "").replace(".", "")
		print("-- Getting Parsing 24h Sale - " + pharseName)
		# sess.render('/var/www/TNTDroid/droid-Discord/images/unity-24hParsing.png')
	else:
		pharseName = dbPackageName
		print "-- There was No text to fetch "
		# sess.render('/var/www/TNTDroid/droid-Discord/images/unity-24hParsing-Failed.png')


else:
	pharseName = ""


# change this from 1 to 0 to disable
if pharseName != dbPackageName and 1 == 1 and pharseTest != None:

	sess.visit('https://www.assetstore.unity3d.com/en/' + pharseLink) 

	#http://doc.scrapy.org/en/latest/topics/selectors.html
	packageName = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/h1').text()
	publisherName = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/div[1]/div[1]/a[2]').text()
	categoryDetail = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/div[1]/div[1]/a[1]').text()
	percentageDiscount = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/div[1]/div[1]/div[2]/div').text().replace(" OFF", "").replace("%", "")
	discountPrice = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/div[1]/div[1]/span[1]').text().replace("$", "")
	fullPrice = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/div[1]/div[1]/span[2]').text().replace("$", "")
	mainImage = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[1]').get_attr('style').replace("background-image: url(", "").replace(");", "")
	smallImage = sess.at_xpath('/html/head/meta[4]').get_attr('content')
	description = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/div[4]').text()
	dateNow = datetime.datetime.now()
	packageLink = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/div[2]/a[2]').get_attr('href')
	packageFullLink = sess.at_xpath('/html/head/meta[6]').get_attr('content')
	ratingStars = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/div[1]/div[1]/div[1]/span').get_attr('content')
	ratingFeedback = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/div[1]/div[1]/div[1]/div').get_attr('content')

	# http://stackoverflow.com/questions/3411771/multiple-character-replace-with-python
	packageName = unicodedata.normalize('NFKD', packageName).encode('ascii','ignore').replace("(", "").replace(")", "").replace(".", "")
	publisherName = unicodedata.normalize('NFKD', publisherName).encode('ascii','ignore').replace("(", "").replace(")", "").replace(".", "")
	description = unicodedata.normalize('NFKD', description).encode('ascii','ignore')

	categoryDetail = unicodedata.normalize('NFKD', categoryDetail).encode('ascii','ignore')


	print ("-- -- New Package - " + packageName + " from Publisher : " + publisherName)
	# print percentageDiscount
	# print discountPrice
	# print fullPrice
	# print mainImage
	# print packageLink
	# print description

	test = packageName.replace(" ", "_") + "-" + publisherName.replace(" ", "_")
	path = "/var/www/TNTDroid/Discounted/images/"
	localImage = path + test +".png"

	cursor.execute('''INSERT INTO rssDiscounted (packageName, publisherName, percentageDiscount, discountPrice, fullPrice, categoryDetail, mainImage, smallImage, description, date, packageLink, packageFullLink, ratingStars, ratingFeedback, localImage, latest) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1)''', (packageName, publisherName, percentageDiscount, discountPrice, fullPrice, categoryDetail, mainImage, smallImage, description, dateNow, packageLink, packageFullLink, ratingStars, ratingFeedback, localImage))
	print("-- Values Inserted into Database")
	db.commit()

	print("-- Execution Done")
else:
	print("-- Execution Failed")

cursor.close()
# http://stackoverflow.com/questions/1557571/how-to-get-time-of-a-python-program-execution
print("-- Run Time 24h Parsing - %s seconds ---" % (time.time() - start_time))
# sys.exit()