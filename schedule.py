from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup


def get_schedule(username,password):
    driver = webdriver.Chrome()
    small_lists = []

    try:
        driver.get(
            "https://id-ouc-edu-cn-s.otrust.ouc.edu.cn/sso/login?service=https%3A%2F%2Fmy.ouc.edu.cn%2Fcas%2Flogin#/")

        # 登录流程
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, '//*[@id="app"]/div/div[2]/div[3]/div/div/div[1]/div[1]/form/div[1]/div/div[1]/input'))
        ).send_keys(username)

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, '//*[@id="app"]/div/div[2]/div[3]/div/div/div[1]/div[1]/form/div[2]/div/div/input'))
        ).send_keys(password)

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, '//*[@id="app"]/div/div[2]/div[3]/div/div/div[1]/div[1]/form/div[3]/div/button'))
        ).click()

        # 搜索流程
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="app"]/div/div[1]/div[3]/div/div/input'))
        ).send_keys("教务系统")

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="app"]/div/div[1]/div[3]/div/div/span/span/i'))
        ).click()

        # 进入系统
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'el-image__inner'))
        ).click()

        # 窗口切换
        WebDriverWait(driver, 20).until(EC.number_of_windows_to_be(2))
        new_window = [w for w in driver.window_handles if w != driver.current_window_handle][0]
        driver.switch_to.window(new_window)

        # Frame切换
        driver.switch_to.default_content()
        WebDriverWait(driver, 10).until(
            EC.frame_to_be_available_and_switch_to_it((By.ID, "frmbody"))
        )
        WebDriverWait(driver, 10).until(
            EC.frame_to_be_available_and_switch_to_it((By.ID, "frmDesk"))
        )

        # 数据解析
        frame_html = driver.page_source
        soup = BeautifulSoup(frame_html, 'html.parser')
        tables = soup.find_all('table')

        out = []
        for table in tables:
            for row in table.find_all('tr'):
                for cell in row.find_all('td'):
                    tmp = cell.string.replace('\n', '').replace('\t', '').replace(' ', '')
                    out.append(tmp)

        # 数据分组
        front_list = out[:11]
        small_lists = []
        current_list = []

        for item in out[11:]:
            if item.isdigit() and len(current_list) > 0:
                small_lists.append(current_list)
                current_list = [item]
            else:
                current_list.append(item)
        if current_list:
            small_lists.append(current_list)

        return small_lists[:12]

    finally:
        driver.quit()
        print("浏览器已关闭")


# 使用示例
if __name__ == "__main__":
    # result = get_schedule() # 这里替换成自己的学号和密码就可以使用了
    # print("\n最终返回的小列表:")
    # print(result)
