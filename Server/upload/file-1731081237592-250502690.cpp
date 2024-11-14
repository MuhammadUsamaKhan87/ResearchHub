#include <iostream>
#include <vector>
using namespace std;

class Product {
private:
    int data;
    Product* next;
    int productId;

public:
    // Constructor to initialize data members
    Product() : data(0), next(NULL), productId(0) {}

    // Getter and setter for data
    int get() {
        return data;
    }

    void set(int data) {
        this->data = data;
    }

    // Getter and setter for next
    Product* getNext() {
        return next;
    }

    void setNext(Product* nextNode) {
        this->next = nextNode;
    }

    // Getter and setter for productId
    int getProductId() {
        return productId;
    }

    void setProductId(int pid) {
        this->productId = pid;
    }
};

class Stack {
private:
    Product* head;

public:
    Stack() : head(NULL) {}

    // Push function to add element to stack
    void push(int x) {
        Product* newNode = new Product();
        newNode->set(x);
        newNode->setNext(head);
        head = newNode;
        cout << "Pushed digit " << x << " onto the stack." << endl;
    }

    // Top function to get top element of stack
    int top() {
        if (head != NULL) {
            return head->get();
        } else {
            cout << "Stack is empty!" << endl;
            return -1;
        }
    }

    // Pop function to remove top element of stack
    int pop() {
        if (head != NULL) {
            int topData = head->get();
            Product* temp = head;
            head = head->getNext();
            delete temp;
            return topData;
        } else {
            cout << "Stack is empty!" << endl;
            return -1;
        }
    }
};

int main() {
    Stack stack;

    // Generating a sample productId
    int lastTwoDigitsOfStudentId = 70; // Example value
    int productId = 2400 + lastTwoDigitsOfStudentId;
    cout << "The Product ID is : " << productId << endl;
    cout << "_____________________________________" << endl;

    // Extracting digits and storing them in a vector in reverse order
    vector<int> digits;
    int tempId = productId;
    while (tempId > 0) {
        digits.push_back(tempId % 10);
        tempId /= 10;
    }

    // Pushing digits onto the stack in the correct order
    for (int i = digits.size() - 1; i >= 0; --i) {
        stack.push(digits[i]);
    }
    cout << "______________________________________" << endl;

    // Showing the top element of the stack
    cout << "The Top element of the stack is : " << stack.top() << endl;
    cout << "______________________________________" << endl;

    // Popping two elements from the stack
    cout << "The First element popped from the stack is : " << stack.pop() << endl;
    cout << "The Second element popped from the stack is : " << stack.pop() << endl;
    cout << "____________________________________________" << endl;

    // Showing the top element of the stack again
    cout << "The Top element of the stack is : " << stack.top() << endl;

    return 0;
}

