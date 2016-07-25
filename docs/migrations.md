##Creating Migrations

###What are yii2 migrations?
When you install the application for the first time or the db schema is change you can create a migration file update the db with the changes.
This is very useful when you have the application in different enviourments so you won't need to copy the db from one server to another.

###To create migrations . Open Terminal at the helptext root and enter the following:

./yii migrate/create create_all_tables

After you accept you will get the new migration file within the src/migrations folder

You will have something like that:

```
<?php

use yii\db\Migration;

class m160725_140527_create_all_tables extends Migration
{
    public function up()
    {

    }

    public function down()
    {
        echo "m160725_140527_create_all_tables cannot be reverted.\n";

        return false;
    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
```

###Edit the created file
The next step is to put in the function up and down the code to create the tables, relations, insert etc.
The good news is that we have the Jon Chambers module that will help us a lot to build the code :)

We have this utility at helptext.dev/en/utility


###Running the Migration
Just go to the root and run:
```
./yii migrate/up

```





