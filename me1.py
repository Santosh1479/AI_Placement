import requests
import random
from datetime import datetime, timedelta

API_URL = "http://localhost:5000/drives"

companies = ["Google", "Amazon", "Microsoft", "Infosys", "TCS", "Wipro", "Flipkart", "IBM", "Oracle", "SAP"]
roles = ["SDE", "Cloud Engineer", "Data Analyst", "Frontend Dev", "Backend Dev", "DevOps", "QA Engineer", "ML Engineer"]
skills_pool = ["Python", "Java", "React", "Node.js", "SQL", "AWS", "Docker", "C++", "Spring", "MongoDB", "HTML", "CSS", "JS"]

for i in range(1, 51):
    company = companies[(i-1) % len(companies)]
    role = random.choice(roles)
    skillsRequired = random.sample(skills_pool, k=3)
    cgpaRequired = round(random.uniform(6.0, 9.5), 1)
    offerMoney = random.randint(30000, 200000)
    numRequired = random.randint(5, 20)
    date = (datetime.now() + timedelta(days=random.randint(1, 60))).strftime("%Y-%m-%d")
    drive = {
        "_id": f"DRV{str(i).zfill(3)}",
        "companyName": company,
        "cgpaRequired": cgpaRequired,
        "numStudentsSelected": 0,
        "numRequired": numRequired,
        "skillsRequired": skillsRequired,
        "offerMoney": offerMoney,
        "date": date,
        "role": role,
        "completed": False,
        "currentRound": "aptitude",
        "appliedUSNs": [],
        "rounds": {
            "aptitude": [],
            "groupDiscussion": [],
            "technicalInterview": [],
            "appointed": [],
            "rejected": []
        }
    }
    resp = requests.post(API_URL, json=drive)
    print(f"Drive {i}: Status {resp.status_code} - {resp.text}")