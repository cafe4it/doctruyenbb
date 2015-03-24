Categories.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();
Authors.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();
Stories.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();
Stories2.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();
Chapters.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();