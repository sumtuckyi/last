from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import pandas as pd
import time

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


small_cate_list = [['감자', '당근', '양파', '대파', '콩나물', '버섯'],
                   ['사과', '바나나', '방울토마토', '파인애플'],
                   ['오징어•낙지•문어', '전복•조개', '새우•게', '생선류'],
                   ['소고기', '돼지고기', '닭•오리고기', '소시지•베이컨•하몽', '계란'],
                   ['탕•찌개', '김치•젓갈•장류', '두부•어묵'],
                   ['생수', '탄산수', '주스', '커피'],
                   ['초콜릿', '젤리', '캔디', '쿠키'],
                   ['우유', '두유', '요거트', '치즈', '아이스크림']]


item_list = []
error = []

def crawling(keyword):
# 마켓컬리 베스트 상품 페이지
# url = 'https://www.kurly.com/goods-list?category=029'
# url = 'https://www.kurly.com/categories/907001?filters=&page=1'
    url = f'https://www.kurly.com/search?sword={keyword}'
    driver.get(url)
    driver.implicitly_wait(time_to_wait=5)

    # 상품 div 가져옴
    elements = driver.find_elements(By.CLASS_NAME, 'css-9o2zup')
    # item_list = []
    # 크롤링 딜레이시간, 에러가 날 경우 count+=1 헤서 딜레이를 늘려줄것
    count = 2
    # error = []

    countOfItems = 0

# 상품의 개수만큼 반복

    for i in range(len(elements)):
    # 페이지를 이동하면 driver의 elements를 다시 받아줘야한다.
    # 상품 상세보기로 이동했다가 다시 돌아오면 elements사용에 오류가 났다.
    # 그래서 반복문을 시작할 때 elemets를 새로 받아준다.
        elements = driver.find_elements(By.CLASS_NAME, 'css-9o2zup')
        print('배열의 길이: ', len(elements), elements)
        element = elements[i] # 배열에 있는 상품을 하나씩 가져와서 

        # 제품 이름, 이미지 URL, 가격 가져오기
        item_name = element.find_element(By.CLASS_NAME, 'css-1dry2r1').text
        # ori_img = element.find_element(By.TAG_NAME, 'img').get_attribute('src')
        item_price = element.find_element(By.CLASS_NAME,'css-1tl7659').text
        
        # Wait for the image to be present in the DOM
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, 'img')))

        # Get the src attribute
        ori_img = element.find_element(By.TAG_NAME, 'img').get_attribute('src')
        # URL 주소가 유효하지 않으면 다음 품목으로 건너뛰기
        if ori_img.startswith('data'):
            continue

        # 유효한 상품 카운트
        countOfItems += 1

        # 상품 클릭
        element.click()
        time.sleep(count)

        try:
        # 상세보기 페이지의 elements가져옴
            # details = driver.find_elements(By.ID, 'detail')
        # 영양성분표 이미지 URL
            # detail_img = details[0].find_element(By.TAG_NAME, 'img').get_attribute('src')
        # 리스트에 넣기
            item_list.append({
                'model': 'products.Product',
                'fields': {
                    'item': item_name,
                    'img_url': ori_img,
                    'price': item_price,
                    'category': idx,
                }
            })

            print(countOfItems,'번째 항목 : ', {'item': item_name, 'img_url': ori_img, 'price': item_price})

            if countOfItems == 10:
                print('10 items done!')
                break
            # item_list.append([item_name, ori_img, item_price, detail_img])
            # item_list.append([ori_img, detail_img])
        # 확인
            # print(item_list[-1])
        # 만약 에러가 발생하면
        except:
        # 대기시간 증가 및 확인
            count += 1
            print(count)
        # 에러 리스트에 넣기
            error.append(element)
        # 만약 count가 100번 이상이면 루프 탈출
            if(count>=100):
                break

        # 브라우져 뒤로가기
        driver.execute_script("window.history.go(-1)")
        time.sleep(count)


# 크롬드라이버 가져오기
driver = webdriver.Chrome()
idx = 0
for j in range(len(small_cate_list)):
    for k in range(len(small_cate_list[j])):
        idx += 1
        if '•' in small_cate_list[j][k]:
            keywords = small_cate_list[j][k].split('•')
            print(keywords)
            for tk in keywords:
                keyword = tk
                crawling(keyword)
                print('exit!')

        else:
            keyword = small_cate_list[j][k]
            crawling(keyword)
            print('exit!')


# 작업 완료 후 드라이버 종료
driver.close()
print(error)

# json으로 저장하기
item_list_df = pd.DataFrame(item_list)

item_list_df.to_json('/Users/SSAFY/Desktop/쇼핑몰 DB DATA 크롤링/crawling_code-master/file2.json', orient='records', force_ascii=False)
print("Data saved to JSON file.")
print(error)


# item_list_df = pd.DataFrame(data=item_list, columns=['Item_Name', 'Ori_img_URL', 'Item_Price', 'Detail_img_URL'])
# # item_list = pd.DataFrame(data=item_list,columns=['Item_Name', 'Ori_img_URL', 'detail_img_URL'])
# item_list_df.to_csv(path_or_buf='/Users/sumtuckyi/web crawling/file.csv', index=False)
# # item_list.to_csv(path_or_buf='/Users/sumtuckyi/web crawling/file.csv')
# print("Data saved to CSV file.")
# print(error)