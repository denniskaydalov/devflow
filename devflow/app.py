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
        #print()
        #print(type(ticket), type(tickets), tickets)
        #print()
        id = max(id, ticket.id)

    return id

def get_ticket_status(action : Action) -> Status:
    if 'test' in action.message.lower():
        return Status.in_test
    else:
        return Status.in_dev

def get_max_index_for_status(tickets : Tickets, status : Status) -> int:
    index = 0

    for ticket in tickets:
        if ticket.status == status:
            index = max(index, ticket.index)

    return index

def add_to_data(action : Action):

    file_data : dict = read_data()

    tickets = Tickets(**file_data).tickets

    print(tickets)
    print(action)

    max_id = get_max_id(tickets=tickets)

    status = get_ticket_status(action = action)

    max_index = get_max_index_for_status(tickets = tickets, status = status)

    ticket_from_action = Ticket(id = max_id + 1, 
                                title = action.branch.replace('_', ' '),
                                status = status,
                                content = 'content',
                                index = max_index + 1,
                                branch = action.branch)


    if action.branch in [ticket.branch for ticket in tickets]: # assignee logic
        for i in range(len(tickets)):
            if tickets[i].branch == action.branch:
                tickets[i] = ticket_from_action
                break
    else:
        tickets.append(ticket_from_action)
    
    return ticket_from_action

@app.post("/tickets/")
def create_ticket(action: Action):
    return add_to_data(action = action)

if __name__ == '__main__':
    add_to_data({'username' : 'denniskaydalov',
                       'branch'   : 'main',
                       'message'  : 'Bug fixes',
                       })
    
    


