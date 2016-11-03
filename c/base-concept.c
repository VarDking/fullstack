#include<stdio.h>
#include<ctype.h>
#include<strings.h>
#include<stdlib.h>

#define FALSE 0
#define TRUE 1

void add(int * a){
    (*a)++;
}

struct MPoint{
    int x;
};

//reference struct
void move(struct MPoint * p){
   p->x++; 
}

int  main(int argc,char **argv){
    //base usage
    int a = 1;
    int * pointer_to_a = &a;

    a += 1;

    *pointer_to_a += 1;

    printf("The value of a is now %d\n", a);
    printf("The value of a is now %d\n", *pointer_to_a);

    //struct
    struct point {
        int x;
        int y;
    };

    struct point p;
    p.x = 55;
    p.y = 66;

    printf("point value is %d\n",p.x);
    printf("point value is %d\n",p.y);


    //typede struct
    typedef struct {
        int age;
        int value;
    } person;

    person jack;
    jack.age = 16;
    jack.value= 23;

    printf("jack value is %d\n",jack.age);
    printf("jack value is %d\n",jack.value);

    //by reference
    int price = 12;
    add(&price);
    printf("price is %d\n",price);

    //point to struct
    struct MPoint chen_point;
    chen_point.x = 98;
    printf("Mpoint value  is %d\n",chen_point.x);

    //dynamic allocation
    struct MPoint *  tmp= malloc(sizeof(struct MPoint));
    tmp->x = 1998;
    printf("tmp value  is %d\n",tmp->x);
    free(tmp);


    //unions
    union intParts {
        int theInt;
        char bytes[sizeof(int)];
    };

    union intParts parts;
    parts.theInt =  5968145;
   
    printf("The int is %i\nThe bytes are [%i, %i, %i, %i]\n",
            parts.theInt, parts.bytes[0], parts.bytes[1], parts.bytes[2], parts.bytes[3]); 
}     
