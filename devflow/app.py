from typing import Union, Dict, List, Optional
import json

from fastapi import FastAPI, Request
from pydantic import BaseModel
from enum import Enum

class Status(Enum):
    in_dev = 'in_dev'
    in_test = 'in_test'
    in_review = 'in_review'
    done = 'done'

class Action(BaseModel):
    username : str
    branch : str
    message : str

class Ticket(BaseModel):
    id : int
    title : str
    content : str
    status : Status
    index : int # ?
    reporter : Optional[str] = None
    assignee : Optional[str] = None
    branch : Optional[str] = None

class Tickets(BaseModel):
    tickets : List[Ticket]

app = FastAPI()

def read_data() -> dict:
    with open('src/data.json', 'r') as file:
        data : dict = json.load(file)

        return data

def get_max_id(tickets : Tickets) -> int:
    id = 0
    for ticket in tickets:
        id = max(id, ticket.id)

    return id

def get_ticket_status(action : Action) -> Status:
    if 'test' in action.message.lower():
        return Status.in_test
    elif 'review' in action.message.lower():
        return Status.in_review
    elif 'done' in action.message.lower():
        return Status.done
    else:
        return Status.in_dev

def get_max_index_for_status(tickets : Tickets, status : Status) -> int:
    index = 0

    for ticket in tickets:
        if ticket.status == status:
            index = max(index, ticket.index)

    return index

def add_to_data(action : Action):

    file_data = read_data()

    tickets = Tickets(**file_data).tickets

    max_id = get_max_id(tickets=tickets)

    status = get_ticket_status(action = action)

    max_index = get_max_index_for_status(tickets = tickets, status = status)

    ticket_from_action = Ticket(id = max_id + 1, 
                                title = action.branch.replace('_', ' ').replace('-', ' ').split('/')[-1],
                                status = status,
                                content = action.branch.replace('_', ' ').replace('-', ' '),
                                index = max_index + 1,
                                reporter = action.username,
                                assignee = action.username,
                                branch = action.branch)


    if action.branch in [ticket.branch for ticket in tickets]: # assignee logic
        for i in range(len(tickets)):
            if tickets[i].branch == action.branch:
                ticket_from_action.reporter = tickets[i].reporter

                if action.username not in ticket_from_action.assignee:
                    ticket_from_action.assignee += ',' + action.username
                tickets[i] = ticket_from_action
                break
    else:
        tickets.append(ticket_from_action)

    write_tickets(tickets = tickets)
    

    return ticket_from_action

def write_tickets(tickets : List[Ticket]):
    json = Tickets(tickets = tickets).model_dump_json()

    with open("src/data.json", "w") as f:
        f.write(json)

@app.post("/tickets/")
def create_ticket_full(d: dict):
    print(d)
    return add_to_data(action = Action(username=d['commits'][0]['author']['username'],
                                       branch=d.get('ref', 'unknown'),
                                       message=d['commits'][0]['message']
                                       ))

@app.post("/create/ticket/")
def create_ticket(action: Action):
    return add_to_data(action = action)

@app.post("/review/")
def move_to_review(branch_name : dict):
    branch_name = branch_name['pull_request']['head']['ref']
    
    print(branch_name)

    file_data = read_data()

    tickets = Tickets(**file_data).tickets

    for i in range(len(tickets)):
        print(tickets[i].branch, branch_name)
        if tickets[i].branch == branch_name:
            tickets[i].status = Status.in_review

    write_tickets(tickets = tickets)

    return tickets[i]

@app.post("/done/")
def move_to_done(branch_name : dict):
    branch_name = branch_name['pull_request']['head']['ref']
    file_data = read_data()

    tickets = Tickets(**file_data).tickets

    for i in range(len(tickets)):
        if tickets[i].branch == branch_name:
            tickets[i].status = Status.done

    write_tickets(tickets = tickets)

    return tickets[i]



@app.get("/data/")
def get_data():
    return read_data()

if __name__ == '__main__':
    add_to_data({'username' : 'denniskaydalov',
                       'branch'   : 'main',
                       'message'  : 'Bug fixes',
                       })
    
