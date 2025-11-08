import requests
import random

API_URL = "http://localhost:5000/students/register"

departments = ["Civil"]
skills_list = [
    ["Python", "React"], ["Java", "Spring"], ["C++", "ML"], ["HTML", "CSS", "JS"],
    ["Node.js", "MongoDB"], ["SQL", "Django"], ["Go", "Kubernetes"], ["AWS", "Docker"]
]

for i in range(51, 61):
    dept = random.choice(departments)
    skills = random.choice(skills_list)
    placed = random.choice([True, False])
    lpa = round(random.uniform(2.0, 18.0), 1) if placed else 0
    student = {
        "name": f"Student {i}",
        "usn": f"1AI20CS{str(i).zfill(3)}",
        "email": f"student{i}@example.com",
        "password": "password123",
        "department": dept,
        "skills": skills,
        "placed": placed,
        "lpa": lpa
    }
    resp = requests.post(API_URL, json=student)
    print(f"Student {i}: Status {resp.status_code} - {resp.text}")