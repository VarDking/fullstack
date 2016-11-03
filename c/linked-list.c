#include<stdlib.h>
#include<stdio.h>

int main(int argc,char ** argv){
    //linked list node
    typedef struct node {
        int val;
        struct node * next; 
    } node_t;

    node_t * heade = NULL;
    heade = malloc(sizeof(node_t)); 
    if(heade == NULL){
        return 1; 
    }

    heade->val = 1;
    heade->next = NULL;

}



