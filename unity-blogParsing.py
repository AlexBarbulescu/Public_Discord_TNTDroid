import dryscrape
import MySQLdb
import datetime
import unicodedata
import time 
import sys

start_time = time.time()

# https://github.com/niklasb/dryscrape/issues/7

# python /var/www/TNTDroid/droid-Discord/unity-blogParsing.py

if 'linux' in sys.platform:
    # start xvfb in case no X is running. Make sure xvfb 
    # is installed, otherwise this won't work!
    dryscrape.start_xvfb()

# connects to database
db = MySQLdb.connect("localhost","root","diablo89","discord_bot")
cursor = db.cursor()

# set up a web scraping session
sess = dryscrape.Session(base_url = '')
sess.visit('https://blogs.unity3d.com/')
# we don't need images
sess.set_attribute('auto_load_images', False)
sess.set_attribute('accelerated_compositing_enabled', True)

# time.sleep(5)

pharseTest = sess.at_css('.cd.tdn')

if(pharseTest != None):
	pharseLink = sess.at_css('.cd.tdn').get_attr('href')
else:
	pharseLink = ""

	
# Selects the last link from the table
cursor.execute("SELECT link FROM rssBlog ORDER BY id DESC LIMIT 1")

# checks if the mysql has a row inserted, if not is blank
if cursor.rowcount == 0:
	lastBlogLink = ""
else:
	lastBlogLink = cursor.fetchone()[0]

# change this from 1 to 0 to disable
if pharseLink != lastBlogLink and 1 == 1 and pharseTest != None:

	sess.visit(pharseLink)
	# sess.render('/var/www/TNTDroid/droid-Discord/images/unity-blogParsing.png')


	mainImageTest = sess.at_css('.post-header-image.ic')
	if(mainImageTest != None):
		mainImage = sess.at_css('.post-header-image.ic').get_attr('style').replace("background-image: url(", "").replace(");", "")
	else:
		mainImage = ""

	dateNow = datetime.datetime.now()
	linkBlog = pharseLink

	author = sess.at_css('.avalonbold.post-author>a').text()
	titleBlog = sess.at_css('.mb10').text()
	descriptionBlog = sess.at_css('.content.clear.bb.pb30.mb30').text()

	titleBlog = unicodedata.normalize('NFKD', titleBlog).encode('ascii','ignore').replace("    Unity Blog", "").title()
	descriptionBlog = unicodedata.normalize('NFKD', descriptionBlog).encode('ascii','ignore')
	# http://www.w3schools.com/cssref/pr_text_text-transform.asp
	author = unicodedata.normalize('NFKD', author).encode('ascii','ignore').title()

	print ("-- New Blog Title - " + titleBlog + " Author Name : " + author)
	print descriptionBlog[:250]
	print author

	cursor.execute('''INSERT INTO rssBlog (title, link, content, image, author, date) VALUES (%s, %s, %s, %s, %s, %s)''', (titleBlog, linkBlog, descriptionBlog, mainImage, author, dateNow))
	db.commit()

	print("-- Execution Done")
else:
	# sess.render('/var/www/TNTDroid/droid-Discord/images/unity-blogParsing-Failed.png')
	print("-- Execution Failed")

cursor.close()
# http://stackoverflow.com/questions/1557571/how-to-get-time-of-a-python-program-execution
print("-- Run Time blog Parsing - %s seconds ---" % (time.time() - start_time))