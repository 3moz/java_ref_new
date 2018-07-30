/**
 * This program demonstrations the difference between public and private
 */

 class Test {
     int a; //default access
     public int b; //public access
     private int c; //private access

     //methods to access c
     void setc(int i){//set c's val
        c = i;
     }
    int getc() {
        return c;
    }                 
 }

 class AccessTest {
     public static void main(String args[]) {
         Test ob = new Test();

         //These are OK, a ad b may be accessed directly
         ob.a = 10;
         ob.b = 20;

         //This is not OK and will cause an error
         //ob.c = 100; //Error

         //Must access c through it's methods
         ob.setc(100); //ok
         System.out.println("a, b and c: "+ob.a+" "+ob.b+" "+ob.getc());
     }
 }