This is the Repo for the lifeline arts theme


So this is the theme for lifelineats to install

first install the theme. 
I would do it with a git push
using post-receive like this 
`
#!/bin/bash

GIT_WORK_TREE=/home/bitnami/apps/wordpress/htdocs/wp-content/themes/lla git checkout -f
`

(Remebe it needs to be chmod +x )

Then push it 

You need to install the recaptch.php into the theme directory. This is not kept in the theme due to the theme being public
