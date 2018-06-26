# CapstoneProject



#웹컴파일 기반 교육지원시스템(LMS)

## 구현 스펙

플랫폼 : node

작성언어 : javscript , html  css   ,batch

라이브러리 : jquery

db: mysql

db tool: sequelize



## 기능

웹에디터 지원언어 : c , java ,python

웹 에디터 :  오픈소스 CodeMirror

웹 컴파일 :  Server담당

웹 에디터 활용  

* 웹에서 코딩을하고 결과를 바로 화면을 통해 볼 수 있다
* 제출한 과제를 다운받지않고 웹에서 결과를 확인 할 수 있다.

LMS : 강의지원시스템으로 각 강의별 블로그를 제공한다

아래 게시판 서비스를 제공한다.

* 강의계획서 
* 공지사항 
* 질의응답
* 강의자료 
*  과제 

커뮤니티 : 회원전체가 이용 할 수 있는 커뮤니티

MyInfo : 개인정보및 작성한 글을 확인 할 수 있다.

사용 오픈소스 : codemirror , summer note 



# 핵심 비즈니스 로직

##1.에디터 서비스 로직

###1.1 c언어

![clang](https://user-images.githubusercontent.com/31912670/41890936-fd5b8dd2-794c-11e8-8c88-512fabeff2b8.jpg)



### 1.2 JAVA

![javalang](https://user-images.githubusercontent.com/31912670/41890937-fd88ce00-794c-11e8-8348-c4d8a12b36d6.jpg)



### 1.3 python

![pylang](https://user-images.githubusercontent.com/31912670/41890941-fe0fb230-794c-11e8-8d52-529ab388795a.jpg)



###1.4 입력값 TEXT로 받기

![param](https://user-images.githubusercontent.com/31912670/41890939-fdb55312-794c-11e8-98ac-1d1ecb3d1b0e.jpg)



### 1.5 입력값 FILE로 받기

![param2](https://user-images.githubusercontent.com/31912670/41890940-fde1ccd0-794c-11e8-8a92-1bd1e6fb41ff.jpg)





## 2. LMS 서비스 로직



### 2.1 교수 과제등록

![1](https://user-images.githubusercontent.com/31912670/41891046-763f9068-794d-11e8-8669-d3da6fec23de.jpg)



### 2.2학생 과제 제출

![2](https://user-images.githubusercontent.com/31912670/41890942-fe3a617e-794c-11e8-9cbc-ab24967f75bf.jpg)



###2.3 교수 제출한 과제 확인

![3](https://user-images.githubusercontent.com/31912670/41890943-fe65d444-794c-11e8-993a-8d0701148f70.jpg)



### 2.4 교수 제출한 과제 웹에서 컴파일 실행후 점수채점

![4](https://user-images.githubusercontent.com/31912670/41890944-fe945f58-794c-11e8-87f4-b0fe886108df.jpg)



# 비즈니스 로직 외 기능



## 비회원 Home

![index](https://user-images.githubusercontent.com/31912670/40877621-0e6f50c2-66bf-11e8-84a9-f6023cdaa1d3.jpg)



## 회원 Home

![index_login](https://user-images.githubusercontent.com/31912670/40877623-11b1fece-66bf-11e8-90da-75b03ccef22b.jpg)



## 커뮤니티 페이지



![community](https://user-images.githubusercontent.com/31912670/40877635-280479f4-66bf-11e8-88b0-c0bd2d1f8dc1.jpg)





