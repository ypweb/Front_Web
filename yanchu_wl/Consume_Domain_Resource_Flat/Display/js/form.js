/ /   J a v a S c r i p t   D o c u m e n t  
 f u n c t i o n   l o g i n s _ a d ( ) {  
 	 v a r   a d = $ F ( " a d m i n " ) ;  
 	 i f ( a d = = " " )  
 	 {  
 	 	 a l e r t ( " (u7bTN��:Nzz�" ) ;  
 	 	 r e t u r n   f a l s e ;  
 	 }  
 	 r e t u r n   t r u e ;  
 	 }  
 	  
 f u n c t i o n   l o g i n s _ p d ( ) {  
 	 v a r   p d = $ F ( " p a s s w o r d " ) ;  
 	 i f ( p d = = " " )  
 	 {  
 	 	 a l e r t ( " �[xN��:Nzz�" ) ;  
 	 	 r e t u r n   f a l s e ;  
 	 }  
 	 i f ( p d . l e n g t h < 6 )  
 	 {  
 	 	 a l e r t ( " �[xN��\�N6 MO" ) ;  
 	 	 r e t u r n   f a l s e ;  
 	 }  
 	 r e t u r n   t r u e ; 	  
 }  
 f u n c t i o n   l o g i n s ( ) {  
 	 i f ( l o g i n s _ a d ( ) & & l o g i n s _ p d ( ) )  
 	 {  
 	 	 r e t u r n   t r u e ;  
 	 }  
 	 e l s e {  
 	 	 r e t u r n   f a l s e ; 	 	  
 	 	 }  
 	 } 