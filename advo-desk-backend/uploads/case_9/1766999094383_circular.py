'''class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

# Create nodes
n1 = Node(10)
n2 = Node(20)
n3 = Node(30)

# Linking circularly
n1.next = n2
n2.next = n3
n3.next = n1     # LAST NODE POINTS TO FIRST

# Traverse few times
current = n1
for i in range(5):
    print(current.data)
    current = current.next


# Node class
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


# Insert at beginning in circular linked list
def insert_begin(head, data):
    new_node = Node(data)

    # If list is empty
    if head is None:
        head = new_node
        new_node.next = head
        return head

    # Find last node
    temp = head
    while temp.next != head:
        temp = temp.next

    # Insert at beginning
    new_node.next = head
    temp.next = new_node
    head = new_node

    return head


# Traverse
def traverse(head):
    if head is None:
        print("List is empty")
        return

    temp = head
    while True:
        print(temp.data, end=" ")
        temp = temp.next
        if temp == head:
            break
    print()


# ------- TESTING --------
head = None
head = insert_begin(head, 0)
head = insert_begin(head, 20)
head = insert_begin(head, 10)

print("Output (Insert at Beginning):")
traverse(head) '''

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

# Create circular linked list
def create_circular_list(elements):
    head = Node(elements[0])
    temp = head

    for data in elements[1:]:
        new_node = Node(data)
        temp.next = new_node
        temp = new_node

    temp.next = head  # make circular
    return head

# Update a value
def update_value(head, old_value, new_value):
    current = head
    while True:
        if current.data == old_value:
            current.data = new_value
            return True   # Updated successfully
        current = current.next
        if current == head:
            break
    return False  # Value not found

# Display list
def display(head):
    current = head
    while True:
        print(current.data, end=" → ")
        current = current.next
        if current == head:
            break
    print("(back to head)")

# MAIN CODE
elements = [10, 20, 30, 40]
head = create_circular_list(elements)

print("Original Circular Linked List:")
display(head)

print("\nUpdating 30 to 99...")
if update_value(head, 30, 99):
    print("Update Successful!")
else:
    print("Value Not Found!")

print("\nUpdated Circular Linked List:")
display(head)

