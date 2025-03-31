from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from settings import *
driver = webdriver.Chrome()
driver.get("https://id-ouc-edu-cn-s.otrust.ouc.edu.cn/sso/login?service=https%3A%2F%2Fmy.ouc.edu.cn%2Fcas%2Flogin#/")
# 登录界面
in_username=(By.XPATH,'//*[@id="app"]/div/div[2]/div[3]/div/div/div[1]/div[1]/form/div[1]/div/div[1]/input')
WebDriverWait(driver, 10).until(EC.presence_of_element_located(in_username)).send_keys(username)
in_password=(By.XPATH, '//*[@id="app"]/div/div[2]/div[3]/div/div/div[1]/div[1]/form/div[2]/div/div/input')
WebDriverWait(driver,10).until(EC.presence_of_element_located(in_password)).send_keys(password)
in_button=(By.XPATH, '//*[@id="app"]/div/div[2]/div[3]/div/div/div[1]/div[1]/form/div[3]/div/button')
WebDriverWait(driver,10).until(EC.presence_of_element_located(in_button)).click()
in_search=(By.XPATH,'//*[@id="app"]/div/div[1]/div[3]/div/div/input')
WebDriverWait(driver,10).until(EC.presence_of_element_located(in_search)).send_keys("教务系统")
search_button=(By.XPATH,'//*[@id="app"]/div/div[1]/div[3]/div/div/span/span/i')
WebDriverWait(driver,10).until(EC.presence_of_element_located(search_button)).click()
enter_button=(By.CLASS_NAME,'el-image__inner')
WebDriverWait(driver,10).until(EC.presence_of_element_located(enter_button)).click()
time.sleep(5)
