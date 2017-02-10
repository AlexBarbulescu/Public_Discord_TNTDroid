import dryscrape
import MySQLdb
import datetime
import unicodedata
import time 
import sys

start_time = time.time()

# python /var/www/TNTDroid/droid-Discord/unity-fetchPackages.py
if 'linux' in sys.platform:
    # start xvfb in case no X is running. Make sure xvfb 
    # is installed, otherwise this won't work!
    dryscrape.start_xvfb()

# connects to database
db = MySQLdb.connect("localhost","root","diablo89","discord_bot")
cursor = db.cursor()

# set up a web scraping session
sess = dryscrape.Session(base_url = '')
sess.visit("https://www.assetstore.unity3d.com/en/#!/content/" + sys.argv[1])
# we don't need images
sess.set_attribute('auto_load_images', False)
sess.set_attribute('accelerated_compositing_enabled', True)

# time.sleep(5)

pharseTest = sess.at_css('.overview-text-overlay>h1')

# change this from 1 to 0 to disable
if 1 == 1 and pharseTest != None:

	#http://doc.scrapy.org/en/latest/topics/selectors.html
	packageName = sess.at_css('.overview-text-overlay>h1').text()
	publisherName = sess.at_xpath('/html/body/div[2]/div[2]/div/section[1]/div/div/div[1]/div/div[2]/div/div[1]/div[1]/a[2]').text()
	publisherName = sess.at_xpath(".//*[@id='contentoverview']/div/div[2]/div/div[1]/div[1]/a[2]").text()
	categoryDetail = sess.at_css('.livelink.detaillink').text()

	price = sess.at_css('.price').text().replace("$", "")

	mainImage = sess.at_css('.background').get_attr('style').replace("background-image: url(", "").replace(");", "")
	smallImage = sess.at_xpath('/html/head/meta[4]').get_attr('content')
	description = sess.at_css('.fulldescription.vscroll').text()
	dateNow = datetime.datetime.now()
	packageLink = sess.at_xpath(".//*[@id='contentoverview']/div/div[2]/div/div[2]/a[2]").get_attr('href')
	packageFullLink = sess.at_xpath('/html/head/meta[6]').get_attr('content')

	unrated = sess.at_xpath(".//*[@id='contentoverview']/div/div[2]/div/div[1]/div[1]/div/span[2]")

	if unrated != None:
		ratingStars = "0"
		ratingFeedback = "0"
	else:
		ratingStars = sess.at_xpath(".//*[@id='contentoverview']/div/div[2]/div/div[1]/div[1]/div/span").get_attr('content')
		ratingFeedback = sess.at_xpath(".//*[@id='contentoverview']/div/div[2]/div/div[1]/div[1]/div/div").get_attr('content')

	# http://stackoverflow.com/questions/3411771/multiple-character-replace-with-python
	packageName = unicodedata.normalize('NFKD', packageName).encode('ascii','ignore').replace("(", "").replace(")", "").replace(".", "")
	publisherName = unicodedata.normalize('NFKD', publisherName).encode('ascii','ignore').replace("(", "").replace(")", "").replace(".", "")
	description = unicodedata.normalize('NFKD', description).encode('ascii','ignore')

	categoryDetail = unicodedata.normalize('NFKD', categoryDetail).encode('ascii','ignore')


	print ("-- -- New Package - " + packageName + " from Publisher : " + publisherName)
	print price
	print mainImage
	print packageLink
	print ("-- -- Rating Stars - " + ratingStars + " ratingFeedback : (" + ratingFeedback + ")")
	# print description

	test = packageName.replace(" ", "_") + "-" + publisherName.replace(" ", "_")
	path = "/var/www/TNTDroid/Discounted/images/"
	localImage = path + test +".png"


	cursor.execute("""UPDATE advertisment SET verify=0, packageName=%s, publisherName=%s, price=%s, smallImage=%s, mainImage=%s, description=%s, categoryDetail=%s, packageLink=%s, packageFullLink=%s, ratingStars=%s, ratingFeedback=%s, localImage=%s, date=%s, render=1 WHERE ID=%s """, (packageName, publisherName, price, smallImage, mainImage, description, categoryDetail, packageLink, packageFullLink, ratingStars, ratingFeedback, localImage, dateNow, sys.argv[2]))
	print("-- Values Inserted into Database")
	db.commit()

	print("-- Execution Done")
else:
	print("-- Execution Failed")

cursor.close()
# http://stackoverflow.com/questions/1557571/how-to-get-time-of-a-python-program-execution
print("-- Run Time - %s seconds ---" % (time.time() - start_time))
# sys.exit()