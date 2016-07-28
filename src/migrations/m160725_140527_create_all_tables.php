<?php

use yii\db\Migration;

// case_category,
// cases,
// contact,
// contact_phone,
// country,
// language,
// language_source,
// languages,
// message,
// message_type,
// outcome_category,
// phone,
// profile,
// qry_next_available_user,
// sender_type,
// severity,
// text_template


class m160725_140527_create_all_tables extends Migration {

    public function up() {

        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `case_category`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `cases`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `contact`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `contact_phone`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `country`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `language_source`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `languages`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `message`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `message_type`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `outcome_category`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `phone`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `profile`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `qry_next_available_user`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `sender_type`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `severity`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `text_template`');
        $this->execute('SET foreign_key_checks = 1;');


        $tables = Yii::$app->db->schema->getTableNames();
        $dbType = $this->db->driverName;
        $tableOptions_mysql = "CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB";
        $tableOptions_mssql = "";
        $tableOptions_pgsql = "";
        $tableOptions_sqlite = "";
        /* MYSQL */
        if (!in_array('case_category', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%case_category}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'case_category' => 'VARCHAR(50) NOT NULL',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('cases', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%cases}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'id_contact' => 'INT(11) NULL',
                    'id_phone' => 'VARCHAR(15) NULL',
                    'id_user' => 'INT(11) NULL',
                    'id_category' => 'INT(11) NULL',
                    'id_outcome' => 'INT(11) NULL',
                    'id_severity' => 'INT(11) NULL',
                    'start_date' => 'DATETIME NULL',
                    'close_date' => 'DATETIME NULL',
                    'state' => 'BIT(1) NULL',
                    'comments' => 'TEXT NULL',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('contact', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%contact}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'id_country' => 'INT(11) NULL',
                    'id_language' => 'INT(11) NULL',
                    'first_name' => 'VARCHAR(50) NOT NULL',
                    'last_name' => 'VARCHAR(50) NULL',
                    'gender' => 'VARCHAR(10) NULL',
                    'marital_status' => 'VARCHAR(10) NULL',
                    'birthday' => 'DATE NULL',
                    'address_line1' => 'VARCHAR(50) NULL',
                    'address_line2' => 'VARCHAR(50) NULL',
                    'city' => 'VARCHAR(50) NULL',
                    'state' => 'VARCHAR(50) NULL',
                    'postal_code' => 'VARCHAR(15) NULL',
                    'comments' => 'VARCHAR(100) NULL',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('contact_phone', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%contact_phone}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'id_contact' => 'INT(11) NOT NULL DEFAULT \'0\'',
                    'id_phone' => 'VARCHAR(15) NOT NULL DEFAULT \'0\'',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('country', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%country}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'country_code' => 'VARCHAR(2) NOT NULL DEFAULT \'\'',
                    'country_name' => 'VARCHAR(100) NOT NULL DEFAULT \'\'',
                        ], $tableOptions_mysql);
            }
        }


        /* MYSQL */
        if (!in_array('language_source', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%language_source}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'category' => 'VARCHAR(32) NULL',
                    'message' => 'TEXT NULL',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('languages', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%languages}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'language' => 'MEDIUMTEXT NOT NULL',
                    'short_name' => 'MEDIUMTEXT NOT NULL',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('message', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%message}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'id_phone' => 'VARCHAR(15) NOT NULL DEFAULT \'0\'',
                    'id_case' => 'INT(11) NOT NULL DEFAULT \'0\'',
                    'id_sender_type' => 'INT(11) NOT NULL DEFAULT \'0\'',
                    'id_message_type' => 'INT(11) NULL',
                    'message' => 'VARCHAR(50) NOT NULL DEFAULT \'0\'',
                    'sent' => 'DATETIME NOT NULL DEFAULT \'0000-00-00 00:00:00\'',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('message_type', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%message_type}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'type' => 'VARCHAR(100) NULL',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('outcome_category', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%outcome_category}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'outcome' => 'VARCHAR(50) NOT NULL DEFAULT \'0\'',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('phone', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%phone}}', [
                    'id' => 'VARCHAR(15) NOT NULL',
                    0 => 'PRIMARY KEY (`id`)',
                    'comment' => 'VARCHAR(200) NULL',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('profile', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%profile}}', [
                    'user_id' => 'INT(11) NOT NULL',
                    0 => 'PRIMARY KEY (`user_id`)',
                    'name' => 'VARCHAR(255) NULL',
                    'public_email' => 'VARCHAR(255) NULL',
                    'gravatar_email' => 'VARCHAR(255) NULL',
                    'gravatar_id' => 'VARCHAR(32) NULL',
                    'location' => 'VARCHAR(255) NULL',
                    'website' => 'VARCHAR(255) NULL',
                    'bio' => 'TEXT NULL',
                    'id_country' => 'INT(11) NULL',
                    'availability' => 'TINYINT(1) NULL',
                    'skills' => 'TEXT NULL',
                    'firstname' => 'VARCHAR(255) NULL',
                    'lastname' => 'VARCHAR(255) NULL',
                    'birthday' => 'DATE NOT NULL',
                    'avatar' => 'VARCHAR(255) NOT NULL',
                    'terms' => 'TINYINT(1) NOT NULL DEFAULT \'0\'',
                    'phone' => 'VARCHAR(15) NULL',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('qry_next_available_user', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%qry_next_available_user}}', [
                    'id' => 'INT(11) NOT NULL',
                    'name' => 'VARCHAR(255) NULL',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('sender_type', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%sender_type}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'sender_type' => 'VARCHAR(50) NOT NULL DEFAULT \'0\'',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('severity', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%severity}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'severity' => 'VARCHAR(50) NOT NULL',
                    'sla' => 'TEXT NOT NULL',
                        ], $tableOptions_mysql);
            }
        }

        /* MYSQL */
        if (!in_array('text_template', $tables)) {
            if ($dbType == "mysql") {
                $this->createTable('{{%text_template}}', [
                    'id' => 'INT(11) NOT NULL AUTO_INCREMENT',
                    0 => 'PRIMARY KEY (`id`)',
                    'name' => 'VARCHAR(50) NOT NULL DEFAULT \'0\'',
                    'message' => 'VARCHAR(200) NOT NULL DEFAULT \'0\'',
                        ], $tableOptions_mysql);
            }
        }


        $this->createIndex('idx_id_contact_9123_00', 'cases', 'id_contact', 0);
        $this->createIndex('idx_id_category_9123_01', 'cases', 'id_category', 0);
        $this->createIndex('idx_id_outcome_9123_02', 'cases', 'id_outcome', 0);
        $this->createIndex('idx_id_severity_9124_03', 'cases', 'id_severity', 0);
        $this->createIndex('idx_id_user_9124_04', 'cases', 'id_user', 0);
        $this->createIndex('idx_id_phone_9124_05', 'cases', 'id_phone', 0);
        $this->createIndex('idx_id_country_9167_06', 'contact', 'id_country', 0);
        $this->createIndex('idx_id_language_9168_07', 'contact', 'id_language', 0);
        $this->createIndex('idx_id_phone_9198_08', 'contact_phone', 'id_phone', 0);
        $this->createIndex('idx_id_contact_9198_09', 'contact_phone', 'id_contact', 0);
        $this->createIndex('idx_id_phone_9401_10', 'message', 'id_phone', 0);
        $this->createIndex('idx_id_case_9401_11', 'message', 'id_case', 0);
        $this->createIndex('idx_id_sender_type_9401_12', 'message', 'id_sender_type', 0);
        $this->createIndex('idx_id_message_type_9401_13', 'message', 'id_message_type', 0);

        $this->execute('SET foreign_key_checks = 0');
        $this->addForeignKey('fk_case_category_9119_00', '{{%cases}}', 'id_category', '{{%case_category}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_contact_9119_01', '{{%cases}}', 'id_contact', '{{%contact}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_outcome_category_9119_02', '{{%cases}}', 'id_outcome', '{{%outcome_category}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_severity_9119_03', '{{%cases}}', 'id_severity', '{{%severity}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_user_9119_04', '{{%cases}}', 'id_user', '{{%user}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_country_9163_05', '{{%contact}}', 'id_country', '{{%country}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_languages_9164_06', '{{%contact}}', 'id_language', '{{%languages}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_contact_9194_07', '{{%contact_phone}}', 'id_contact', '{{%contact}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_phone_9194_08', '{{%contact_phone}}', 'id_phone', '{{%phone}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_cases_9396_09', '{{%message}}', 'id_case', '{{%cases}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_message_type_9396_010', '{{%message}}', 'id_message_type', '{{%message_type}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_sender_type_9397_011', '{{%message}}', 'id_sender_type', '{{%sender_type}}', 'id', 'CASCADE', 'NO ACTION');
        $this->addForeignKey('fk_user_9525_012', '{{%profile}}', 'user_id', '{{%user}}', 'id', 'CASCADE', 'NO ACTION');
        $this->execute('SET foreign_key_checks = 1;');

        $this->execute('SET foreign_key_checks = 0');
        $this->insert('{{%case_category}}', ['id' => '1', 'case_category' => 'Not Set']);
        $this->insert('{{%case_category}}', ['id' => '2', 'case_category' => 'Deportation']);
        $this->insert('{{%case_category}}', ['id' => '3', 'case_category' => 'Detention']);
        $this->insert('{{%case_category}}', ['id' => '4', 'case_category' => 'Information']);
        $this->insert('{{%case_category}}', ['id' => '5', 'case_category' => 'Medical Related']);
        $this->insert('{{%case_category}}', ['id' => '6', 'case_category' => 'Others']);
        $this->insert('{{%case_category}}', ['id' => '7', 'case_category' => 'Eviction']);
        $this->insert('{{%cases}}', ['id' => '1', 'id_contact' => '1', 'id_phone' => '+447508849527', 'id_user' => '2', 'id_category' => '3', 'id_outcome' => '2', 'id_severity' => '1', 'start_date' => '2016-07-05 14:54:22', 'close_date' => '2016-07-05 14:54:24', 'state' => '', 'comments' => 'Main testing case']);
        $this->insert('{{%cases}}', ['id' => '6', 'id_contact' => '16', 'id_phone' => '', 'id_user' => '4', 'id_category' => '', 'id_outcome' => '', 'id_severity' => '', 'start_date' => '2016-07-14 17:23:37', 'close_date' => '', 'state' => '', 'comments' => 'New case to review']);
        $this->insert('{{%contact}}', ['id' => '1', 'id_country' => '3', 'id_language' => '', 'first_name' => 'Client Nokia Phone', 'last_name' => 'silva', 'gender' => 'M', 'marital_status' => 'Maried', 'birthday' => '2016-06-27', 'address_line1' => 'afasf', 'address_line2' => 'asfasf', 'city' => 'asfasf', 'state' => 'asfasf', 'postal_code' => '234234', 'comments' => 'asfasdf']);
        $this->insert('{{%contact}}', ['id' => '2', 'id_country' => '6', 'id_language' => '', 'first_name' => 'tester2', 'last_name' => 'asfasf', 'gender' => 'F', 'marital_status' => 'Maried', 'birthday' => '2016-06-27', 'address_line1' => 'asfasf', 'address_line2' => 'asfasf', 'city' => 'asfasf', 'state' => '', 'postal_code' => '', 'comments' => 'asfasfasf']);
        $this->insert('{{%contact}}', ['id' => '3', 'id_country' => '16', 'id_language' => '', 'first_name' => 'Client no phone', 'last_name' => 'Client no phone', 'gender' => 'M', 'marital_status' => 'Maried', 'birthday' => '2016-07-20', 'address_line1' => '', 'address_line2' => '', 'city' => '', 'state' => '', 'postal_code' => '', 'comments' => '']);
        $this->insert('{{%contact}}', ['id' => '15', 'id_country' => '', 'id_language' => '', 'first_name' => 'no name yet', 'last_name' => '', 'gender' => '', 'marital_status' => '', 'birthday' => '', 'address_line1' => '', 'address_line2' => '', 'city' => '', 'state' => '', 'postal_code' => '', 'comments' => '']);
        $this->insert('{{%contact}}', ['id' => '16', 'id_country' => '', 'id_language' => '', 'first_name' => 'no name yet', 'last_name' => '', 'gender' => '', 'marital_status' => '', 'birthday' => '', 'address_line1' => '', 'address_line2' => '', 'city' => '', 'state' => '', 'postal_code' => '', 'comments' => '']);
        $this->insert('{{%contact_phone}}', ['id' => '2', 'id_contact' => '1', 'id_phone' => '+447508849527']);
        $this->insert('{{%contact_phone}}', ['id' => '16', 'id_contact' => '16', 'id_phone' => '+7968637380']);
        $this->insert('{{%country}}', ['id' => '1', 'country_code' => 'AF', 'country_name' => 'Afghanistan']);
        $this->insert('{{%country}}', ['id' => '2', 'country_code' => 'AL', 'country_name' => 'Albania']);
        $this->insert('{{%country}}', ['id' => '3', 'country_code' => 'DZ', 'country_name' => 'Algeria']);
        $this->insert('{{%country}}', ['id' => '4', 'country_code' => 'DS', 'country_name' => 'American Samoa']);
        $this->insert('{{%country}}', ['id' => '5', 'country_code' => 'AD', 'country_name' => 'Andorra']);
        $this->insert('{{%country}}', ['id' => '6', 'country_code' => 'AO', 'country_name' => 'Angola']);
        $this->insert('{{%country}}', ['id' => '7', 'country_code' => 'AI', 'country_name' => 'Anguilla']);
        $this->insert('{{%country}}', ['id' => '8', 'country_code' => 'AQ', 'country_name' => 'Antarctica']);
        $this->insert('{{%country}}', ['id' => '9', 'country_code' => 'AG', 'country_name' => 'Antigua and Barbuda']);
        $this->insert('{{%country}}', ['id' => '10', 'country_code' => 'AR', 'country_name' => 'Argentina']);
        $this->insert('{{%country}}', ['id' => '11', 'country_code' => 'AM', 'country_name' => 'Armenia']);
        $this->insert('{{%country}}', ['id' => '12', 'country_code' => 'AW', 'country_name' => 'Aruba']);
        $this->insert('{{%country}}', ['id' => '13', 'country_code' => 'AU', 'country_name' => 'Australia']);
        $this->insert('{{%country}}', ['id' => '14', 'country_code' => 'AT', 'country_name' => 'Austria']);
        $this->insert('{{%country}}', ['id' => '15', 'country_code' => 'AZ', 'country_name' => 'Azerbaijan']);
        $this->insert('{{%country}}', ['id' => '16', 'country_code' => 'BS', 'country_name' => 'Bahamas']);
        $this->insert('{{%country}}', ['id' => '17', 'country_code' => 'BH', 'country_name' => 'Bahrain']);
        $this->insert('{{%country}}', ['id' => '18', 'country_code' => 'BD', 'country_name' => 'Bangladesh']);
        $this->insert('{{%country}}', ['id' => '19', 'country_code' => 'BB', 'country_name' => 'Barbados']);
        $this->insert('{{%country}}', ['id' => '20', 'country_code' => 'BY', 'country_name' => 'Belarus']);
        $this->insert('{{%country}}', ['id' => '21', 'country_code' => 'BE', 'country_name' => 'Belgium']);
        $this->insert('{{%country}}', ['id' => '22', 'country_code' => 'BZ', 'country_name' => 'Belize']);
        $this->insert('{{%country}}', ['id' => '23', 'country_code' => 'BJ', 'country_name' => 'Benin']);
        $this->insert('{{%country}}', ['id' => '24', 'country_code' => 'BM', 'country_name' => 'Bermuda']);
        $this->insert('{{%country}}', ['id' => '25', 'country_code' => 'BT', 'country_name' => 'Bhutan']);
        $this->insert('{{%country}}', ['id' => '26', 'country_code' => 'BO', 'country_name' => 'Bolivia']);
        $this->insert('{{%country}}', ['id' => '27', 'country_code' => 'BA', 'country_name' => 'Bosnia and Herzegovina']);
        $this->insert('{{%country}}', ['id' => '28', 'country_code' => 'BW', 'country_name' => 'Botswana']);
        $this->insert('{{%country}}', ['id' => '29', 'country_code' => 'BV', 'country_name' => 'Bouvet Island']);
        $this->insert('{{%country}}', ['id' => '30', 'country_code' => 'BR', 'country_name' => 'Brazil']);
        $this->insert('{{%country}}', ['id' => '31', 'country_code' => 'IO', 'country_name' => 'British Indian Ocean Territory']);
        $this->insert('{{%country}}', ['id' => '32', 'country_code' => 'BN', 'country_name' => 'Brunei Darussalam']);
        $this->insert('{{%country}}', ['id' => '33', 'country_code' => 'BG', 'country_name' => 'Bulgaria']);
        $this->insert('{{%country}}', ['id' => '34', 'country_code' => 'BF', 'country_name' => 'Burkina Faso']);
        $this->insert('{{%country}}', ['id' => '35', 'country_code' => 'BI', 'country_name' => 'Burundi']);
        $this->insert('{{%country}}', ['id' => '36', 'country_code' => 'KH', 'country_name' => 'Cambodia']);
        $this->insert('{{%country}}', ['id' => '37', 'country_code' => 'CM', 'country_name' => 'Cameroon']);
        $this->insert('{{%country}}', ['id' => '38', 'country_code' => 'CA', 'country_name' => 'Canada']);
        $this->insert('{{%country}}', ['id' => '39', 'country_code' => 'CV', 'country_name' => 'Cape Verde']);
        $this->insert('{{%country}}', ['id' => '40', 'country_code' => 'KY', 'country_name' => 'Cayman Islands']);
        $this->insert('{{%country}}', ['id' => '41', 'country_code' => 'CF', 'country_name' => 'Central African Republic']);
        $this->insert('{{%country}}', ['id' => '42', 'country_code' => 'TD', 'country_name' => 'Chad']);
        $this->insert('{{%country}}', ['id' => '43', 'country_code' => 'CL', 'country_name' => 'Chile']);
        $this->insert('{{%country}}', ['id' => '44', 'country_code' => 'CN', 'country_name' => 'China']);
        $this->insert('{{%country}}', ['id' => '45', 'country_code' => 'CX', 'country_name' => 'Christmas Island']);
        $this->insert('{{%country}}', ['id' => '46', 'country_code' => 'CC', 'country_name' => 'Cocos (Keeling) Islands']);
        $this->insert('{{%country}}', ['id' => '47', 'country_code' => 'CO', 'country_name' => 'Colombia']);
        $this->insert('{{%country}}', ['id' => '48', 'country_code' => 'KM', 'country_name' => 'Comoros']);
        $this->insert('{{%country}}', ['id' => '49', 'country_code' => 'CG', 'country_name' => 'Congo']);
        $this->insert('{{%country}}', ['id' => '50', 'country_code' => 'CK', 'country_name' => 'Cook Islands']);
        $this->insert('{{%country}}', ['id' => '51', 'country_code' => 'CR', 'country_name' => 'Costa Rica']);
        $this->insert('{{%country}}', ['id' => '52', 'country_code' => 'HR', 'country_name' => 'Croatia (Hrvatska)']);
        $this->insert('{{%country}}', ['id' => '53', 'country_code' => 'CU', 'country_name' => 'Cuba']);
        $this->insert('{{%country}}', ['id' => '54', 'country_code' => 'CY', 'country_name' => 'Cyprus']);
        $this->insert('{{%country}}', ['id' => '55', 'country_code' => 'CZ', 'country_name' => 'Czech Republic']);
        $this->insert('{{%country}}', ['id' => '56', 'country_code' => 'DK', 'country_name' => 'Denmark']);
        $this->insert('{{%country}}', ['id' => '57', 'country_code' => 'DJ', 'country_name' => 'Djibouti']);
        $this->insert('{{%country}}', ['id' => '58', 'country_code' => 'DM', 'country_name' => 'Dominica']);
        $this->insert('{{%country}}', ['id' => '59', 'country_code' => 'DO', 'country_name' => 'Dominican Republic']);
        $this->insert('{{%country}}', ['id' => '60', 'country_code' => 'TP', 'country_name' => 'East Timor']);
        $this->insert('{{%country}}', ['id' => '61', 'country_code' => 'EC', 'country_name' => 'Ecuador']);
        $this->insert('{{%country}}', ['id' => '62', 'country_code' => 'EG', 'country_name' => 'Egypt']);
        $this->insert('{{%country}}', ['id' => '63', 'country_code' => 'SV', 'country_name' => 'El Salvador']);
        $this->insert('{{%country}}', ['id' => '64', 'country_code' => 'GQ', 'country_name' => 'Equatorial Guinea']);
        $this->insert('{{%country}}', ['id' => '65', 'country_code' => 'ER', 'country_name' => 'Eritrea']);
        $this->insert('{{%country}}', ['id' => '66', 'country_code' => 'EE', 'country_name' => 'Estonia']);
        $this->insert('{{%country}}', ['id' => '67', 'country_code' => 'ET', 'country_name' => 'Ethiopia']);
        $this->insert('{{%country}}', ['id' => '68', 'country_code' => 'FK', 'country_name' => 'Falkland Islands (Islas Malvinas)']);
        $this->insert('{{%country}}', ['id' => '69', 'country_code' => 'FO', 'country_name' => 'Faroe Islands']);
        $this->insert('{{%country}}', ['id' => '70', 'country_code' => 'FJ', 'country_name' => 'Fiji']);
        $this->insert('{{%country}}', ['id' => '71', 'country_code' => 'FI', 'country_name' => 'Finland']);
        $this->insert('{{%country}}', ['id' => '72', 'country_code' => 'FR', 'country_name' => 'France']);
        $this->insert('{{%country}}', ['id' => '73', 'country_code' => 'FX', 'country_name' => 'France, Metropolitan']);
        $this->insert('{{%country}}', ['id' => '74', 'country_code' => 'GF', 'country_name' => 'French Guiana']);
        $this->insert('{{%country}}', ['id' => '75', 'country_code' => 'PF', 'country_name' => 'French Polynesia']);
        $this->insert('{{%country}}', ['id' => '76', 'country_code' => 'TF', 'country_name' => 'French Southern Territories']);
        $this->insert('{{%country}}', ['id' => '77', 'country_code' => 'GA', 'country_name' => 'Gabon']);
        $this->insert('{{%country}}', ['id' => '78', 'country_code' => 'GM', 'country_name' => 'Gambia']);
        $this->insert('{{%country}}', ['id' => '79', 'country_code' => 'GE', 'country_name' => 'Georgia']);
        $this->insert('{{%country}}', ['id' => '80', 'country_code' => 'DE', 'country_name' => 'Germany']);
        $this->insert('{{%country}}', ['id' => '81', 'country_code' => 'GH', 'country_name' => 'Ghana']);
        $this->insert('{{%country}}', ['id' => '82', 'country_code' => 'GI', 'country_name' => 'Gibraltar']);
        $this->insert('{{%country}}', ['id' => '83', 'country_code' => 'GK', 'country_name' => 'Guernsey']);
        $this->insert('{{%country}}', ['id' => '84', 'country_code' => 'GR', 'country_name' => 'Greece']);
        $this->insert('{{%country}}', ['id' => '85', 'country_code' => 'GL', 'country_name' => 'Greenland']);
        $this->insert('{{%country}}', ['id' => '86', 'country_code' => 'GD', 'country_name' => 'Grenada']);
        $this->insert('{{%country}}', ['id' => '87', 'country_code' => 'GP', 'country_name' => 'Guadeloupe']);
        $this->insert('{{%country}}', ['id' => '88', 'country_code' => 'GU', 'country_name' => 'Guam']);
        $this->insert('{{%country}}', ['id' => '89', 'country_code' => 'GT', 'country_name' => 'Guatemala']);
        $this->insert('{{%country}}', ['id' => '90', 'country_code' => 'GN', 'country_name' => 'Guinea']);
        $this->insert('{{%country}}', ['id' => '91', 'country_code' => 'GW', 'country_name' => 'Guinea-Bissau']);
        $this->insert('{{%country}}', ['id' => '92', 'country_code' => 'GY', 'country_name' => 'Guyana']);
        $this->insert('{{%country}}', ['id' => '93', 'country_code' => 'HT', 'country_name' => 'Haiti']);
        $this->insert('{{%country}}', ['id' => '94', 'country_code' => 'HM', 'country_name' => 'Heard and Mc Donald Islands']);
        $this->insert('{{%country}}', ['id' => '95', 'country_code' => 'HN', 'country_name' => 'Honduras']);
        $this->insert('{{%country}}', ['id' => '96', 'country_code' => 'HK', 'country_name' => 'Hong Kong']);
        $this->insert('{{%country}}', ['id' => '97', 'country_code' => 'HU', 'country_name' => 'Hungary']);
        $this->insert('{{%country}}', ['id' => '98', 'country_code' => 'IS', 'country_name' => 'Iceland']);
        $this->insert('{{%country}}', ['id' => '99', 'country_code' => 'IN', 'country_name' => 'India']);
        $this->insert('{{%country}}', ['id' => '100', 'country_code' => 'IM', 'country_name' => 'Isle of Man']);
        $this->insert('{{%country}}', ['id' => '101', 'country_code' => 'ID', 'country_name' => 'Indonesia']);
        $this->insert('{{%country}}', ['id' => '102', 'country_code' => 'IR', 'country_name' => 'Iran (Islamic Republic of)']);
        $this->insert('{{%country}}', ['id' => '103', 'country_code' => 'IQ', 'country_name' => 'Iraq']);
        $this->insert('{{%country}}', ['id' => '104', 'country_code' => 'IE', 'country_name' => 'Ireland']);
        $this->insert('{{%country}}', ['id' => '105', 'country_code' => 'IL', 'country_name' => 'Israel']);
        $this->insert('{{%country}}', ['id' => '106', 'country_code' => 'IT', 'country_name' => 'Italy']);
        $this->insert('{{%country}}', ['id' => '107', 'country_code' => 'CI', 'country_name' => 'Ivory Coast']);
        $this->insert('{{%country}}', ['id' => '108', 'country_code' => 'JE', 'country_name' => 'Jersey']);
        $this->insert('{{%country}}', ['id' => '109', 'country_code' => 'JM', 'country_name' => 'Jamaica']);
        $this->insert('{{%country}}', ['id' => '110', 'country_code' => 'JP', 'country_name' => 'Japan']);
        $this->insert('{{%country}}', ['id' => '111', 'country_code' => 'JO', 'country_name' => 'Jordan']);
        $this->insert('{{%country}}', ['id' => '112', 'country_code' => 'KZ', 'country_name' => 'Kazakhstan']);
        $this->insert('{{%country}}', ['id' => '113', 'country_code' => 'KE', 'country_name' => 'Kenya']);
        $this->insert('{{%country}}', ['id' => '114', 'country_code' => 'KI', 'country_name' => 'Kiribati']);
        $this->insert('{{%country}}', ['id' => '115', 'country_code' => 'KP', 'country_name' => 'Korea, Democratic People\'s Republic of']);
        $this->insert('{{%country}}', ['id' => '116', 'country_code' => 'KR', 'country_name' => 'Korea, Republic of']);
        $this->insert('{{%country}}', ['id' => '117', 'country_code' => 'XK', 'country_name' => 'Kosovo']);
        $this->insert('{{%country}}', ['id' => '118', 'country_code' => 'KW', 'country_name' => 'Kuwait']);
        $this->insert('{{%country}}', ['id' => '119', 'country_code' => 'KG', 'country_name' => 'Kyrgyzstan']);
        $this->insert('{{%country}}', ['id' => '120', 'country_code' => 'LA', 'country_name' => 'Lao People\'s Democratic Republic']);
        $this->insert('{{%country}}', ['id' => '121', 'country_code' => 'LV', 'country_name' => 'Latvia']);
        $this->insert('{{%country}}', ['id' => '122', 'country_code' => 'LB', 'country_name' => 'Lebanon']);
        $this->insert('{{%country}}', ['id' => '123', 'country_code' => 'LS', 'country_name' => 'Lesotho']);
        $this->insert('{{%country}}', ['id' => '124', 'country_code' => 'LR', 'country_name' => 'Liberia']);
        $this->insert('{{%country}}', ['id' => '125', 'country_code' => 'LY', 'country_name' => 'Libyan Arab Jamahiriya']);
        $this->insert('{{%country}}', ['id' => '126', 'country_code' => 'LI', 'country_name' => 'Liechtenstein']);
        $this->insert('{{%country}}', ['id' => '127', 'country_code' => 'LT', 'country_name' => 'Lithuania']);
        $this->insert('{{%country}}', ['id' => '128', 'country_code' => 'LU', 'country_name' => 'Luxembourg']);
        $this->insert('{{%country}}', ['id' => '129', 'country_code' => 'MO', 'country_name' => 'Macau']);
        $this->insert('{{%country}}', ['id' => '130', 'country_code' => 'MK', 'country_name' => 'Macedonia']);
        $this->insert('{{%country}}', ['id' => '131', 'country_code' => 'MG', 'country_name' => 'Madagascar']);
        $this->insert('{{%country}}', ['id' => '132', 'country_code' => 'MW', 'country_name' => 'Malawi']);
        $this->insert('{{%country}}', ['id' => '133', 'country_code' => 'MY', 'country_name' => 'Malaysia']);
        $this->insert('{{%country}}', ['id' => '134', 'country_code' => 'MV', 'country_name' => 'Maldives']);
        $this->insert('{{%country}}', ['id' => '135', 'country_code' => 'ML', 'country_name' => 'Mali']);
        $this->insert('{{%country}}', ['id' => '136', 'country_code' => 'MT', 'country_name' => 'Malta']);
        $this->insert('{{%country}}', ['id' => '137', 'country_code' => 'MH', 'country_name' => 'Marshall Islands']);
        $this->insert('{{%country}}', ['id' => '138', 'country_code' => 'MQ', 'country_name' => 'Martinique']);
        $this->insert('{{%country}}', ['id' => '139', 'country_code' => 'MR', 'country_name' => 'Mauritania']);
        $this->insert('{{%country}}', ['id' => '140', 'country_code' => 'MU', 'country_name' => 'Mauritius']);
        $this->insert('{{%country}}', ['id' => '141', 'country_code' => 'TY', 'country_name' => 'Mayotte']);
        $this->insert('{{%country}}', ['id' => '142', 'country_code' => 'MX', 'country_name' => 'Mexico']);
        $this->insert('{{%country}}', ['id' => '143', 'country_code' => 'FM', 'country_name' => 'Micronesia, Federated States of']);
        $this->insert('{{%country}}', ['id' => '144', 'country_code' => 'MD', 'country_name' => 'Moldova, Republic of']);
        $this->insert('{{%country}}', ['id' => '145', 'country_code' => 'MC', 'country_name' => 'Monaco']);
        $this->insert('{{%country}}', ['id' => '146', 'country_code' => 'MN', 'country_name' => 'Mongolia']);
        $this->insert('{{%country}}', ['id' => '147', 'country_code' => 'ME', 'country_name' => 'Montenegro']);
        $this->insert('{{%country}}', ['id' => '148', 'country_code' => 'MS', 'country_name' => 'Montserrat']);
        $this->insert('{{%country}}', ['id' => '149', 'country_code' => 'MA', 'country_name' => 'Morocco']);
        $this->insert('{{%country}}', ['id' => '150', 'country_code' => 'MZ', 'country_name' => 'Mozambique']);
        $this->insert('{{%country}}', ['id' => '151', 'country_code' => 'MM', 'country_name' => 'Myanmar']);
        $this->insert('{{%country}}', ['id' => '152', 'country_code' => 'NA', 'country_name' => 'Namibia']);
        $this->insert('{{%country}}', ['id' => '153', 'country_code' => 'NR', 'country_name' => 'Nauru']);
        $this->insert('{{%country}}', ['id' => '154', 'country_code' => 'NP', 'country_name' => 'Nepal']);
        $this->insert('{{%country}}', ['id' => '155', 'country_code' => 'NL', 'country_name' => 'Netherlands']);
        $this->insert('{{%country}}', ['id' => '156', 'country_code' => 'AN', 'country_name' => 'Netherlands Antilles']);
        $this->insert('{{%country}}', ['id' => '157', 'country_code' => 'NC', 'country_name' => 'New Caledonia']);
        $this->insert('{{%country}}', ['id' => '158', 'country_code' => 'NZ', 'country_name' => 'New Zealand']);
        $this->insert('{{%country}}', ['id' => '159', 'country_code' => 'NI', 'country_name' => 'Nicaragua']);
        $this->insert('{{%country}}', ['id' => '160', 'country_code' => 'NE', 'country_name' => 'Niger']);
        $this->insert('{{%country}}', ['id' => '161', 'country_code' => 'NG', 'country_name' => 'Nigeria']);
        $this->insert('{{%country}}', ['id' => '162', 'country_code' => 'NU', 'country_name' => 'Niue']);
        $this->insert('{{%country}}', ['id' => '163', 'country_code' => 'NF', 'country_name' => 'Norfolk Island']);
        $this->insert('{{%country}}', ['id' => '164', 'country_code' => 'MP', 'country_name' => 'Northern Mariana Islands']);
        $this->insert('{{%country}}', ['id' => '165', 'country_code' => 'NO', 'country_name' => 'Norway']);
        $this->insert('{{%country}}', ['id' => '166', 'country_code' => 'OM', 'country_name' => 'Oman']);
        $this->insert('{{%country}}', ['id' => '167', 'country_code' => 'PK', 'country_name' => 'Pakistan']);
        $this->insert('{{%country}}', ['id' => '168', 'country_code' => 'PW', 'country_name' => 'Palau']);
        $this->insert('{{%country}}', ['id' => '169', 'country_code' => 'PS', 'country_name' => 'Palestine']);
        $this->insert('{{%country}}', ['id' => '170', 'country_code' => 'PA', 'country_name' => 'Panama']);
        $this->insert('{{%country}}', ['id' => '171', 'country_code' => 'PG', 'country_name' => 'Papua New Guinea']);
        $this->insert('{{%country}}', ['id' => '172', 'country_code' => 'PY', 'country_name' => 'Paraguay']);
        $this->insert('{{%country}}', ['id' => '173', 'country_code' => 'PE', 'country_name' => 'Peru']);
        $this->insert('{{%country}}', ['id' => '174', 'country_code' => 'PH', 'country_name' => 'Philippines']);
        $this->insert('{{%country}}', ['id' => '175', 'country_code' => 'PN', 'country_name' => 'Pitcairn']);
        $this->insert('{{%country}}', ['id' => '176', 'country_code' => 'PL', 'country_name' => 'Poland']);
        $this->insert('{{%country}}', ['id' => '177', 'country_code' => 'PT', 'country_name' => 'Portugal']);
        $this->insert('{{%country}}', ['id' => '178', 'country_code' => 'PR', 'country_name' => 'Puerto Rico']);
        $this->insert('{{%country}}', ['id' => '179', 'country_code' => 'QA', 'country_name' => 'Qatar']);
        $this->insert('{{%country}}', ['id' => '180', 'country_code' => 'RE', 'country_name' => 'Reunion']);
        $this->insert('{{%country}}', ['id' => '181', 'country_code' => 'RO', 'country_name' => 'Romania']);
        $this->insert('{{%country}}', ['id' => '182', 'country_code' => 'RU', 'country_name' => 'Russian Federation']);
        $this->insert('{{%country}}', ['id' => '183', 'country_code' => 'RW', 'country_name' => 'Rwanda']);
        $this->insert('{{%country}}', ['id' => '184', 'country_code' => 'KN', 'country_name' => 'Saint Kitts and Nevis']);
        $this->insert('{{%country}}', ['id' => '185', 'country_code' => 'LC', 'country_name' => 'Saint Lucia']);
        $this->insert('{{%country}}', ['id' => '186', 'country_code' => 'VC', 'country_name' => 'Saint Vincent and the Grenadines']);
        $this->insert('{{%country}}', ['id' => '187', 'country_code' => 'WS', 'country_name' => 'Samoa']);
        $this->insert('{{%country}}', ['id' => '188', 'country_code' => 'SM', 'country_name' => 'San Marino']);
        $this->insert('{{%country}}', ['id' => '189', 'country_code' => 'ST', 'country_name' => 'Sao Tome and Principe']);
        $this->insert('{{%country}}', ['id' => '190', 'country_code' => 'SA', 'country_name' => 'Saudi Arabia']);
        $this->insert('{{%country}}', ['id' => '191', 'country_code' => 'SN', 'country_name' => 'Senegal']);
        $this->insert('{{%country}}', ['id' => '192', 'country_code' => 'RS', 'country_name' => 'Serbia']);
        $this->insert('{{%country}}', ['id' => '193', 'country_code' => 'SC', 'country_name' => 'Seychelles']);
        $this->insert('{{%country}}', ['id' => '194', 'country_code' => 'SL', 'country_name' => 'Sierra Leone']);
        $this->insert('{{%country}}', ['id' => '195', 'country_code' => 'SG', 'country_name' => 'Singapore']);
        $this->insert('{{%country}}', ['id' => '196', 'country_code' => 'SK', 'country_name' => 'Slovakia']);
        $this->insert('{{%country}}', ['id' => '197', 'country_code' => 'SI', 'country_name' => 'Slovenia']);
        $this->insert('{{%country}}', ['id' => '198', 'country_code' => 'SB', 'country_name' => 'Solomon Islands']);
        $this->insert('{{%country}}', ['id' => '199', 'country_code' => 'SO', 'country_name' => 'Somalia']);
        $this->insert('{{%country}}', ['id' => '200', 'country_code' => 'ZA', 'country_name' => 'South Africa']);
        $this->insert('{{%country}}', ['id' => '201', 'country_code' => 'GS', 'country_name' => 'South Georgia South Sandwich Islands']);
        $this->insert('{{%country}}', ['id' => '202', 'country_code' => 'ES', 'country_name' => 'Spain']);
        $this->insert('{{%country}}', ['id' => '203', 'country_code' => 'LK', 'country_name' => 'Sri Lanka']);
        $this->insert('{{%country}}', ['id' => '204', 'country_code' => 'SH', 'country_name' => 'St. Helena']);
        $this->insert('{{%country}}', ['id' => '205', 'country_code' => 'PM', 'country_name' => 'St. Pierre and Miquelon']);
        $this->insert('{{%country}}', ['id' => '206', 'country_code' => 'SD', 'country_name' => 'Sudan']);
        $this->insert('{{%country}}', ['id' => '207', 'country_code' => 'SR', 'country_name' => 'Suriname']);
        $this->insert('{{%country}}', ['id' => '208', 'country_code' => 'SJ', 'country_name' => 'Svalbard and Jan Mayen Islands']);
        $this->insert('{{%country}}', ['id' => '209', 'country_code' => 'SZ', 'country_name' => 'Swaziland']);
        $this->insert('{{%country}}', ['id' => '210', 'country_code' => 'SE', 'country_name' => 'Sweden']);
        $this->insert('{{%country}}', ['id' => '211', 'country_code' => 'CH', 'country_name' => 'Switzerland']);
        $this->insert('{{%country}}', ['id' => '212', 'country_code' => 'SY', 'country_name' => 'Syrian Arab Republic']);
        $this->insert('{{%country}}', ['id' => '213', 'country_code' => 'TW', 'country_name' => 'Taiwan']);
        $this->insert('{{%country}}', ['id' => '214', 'country_code' => 'TJ', 'country_name' => 'Tajikistan']);
        $this->insert('{{%country}}', ['id' => '215', 'country_code' => 'TZ', 'country_name' => 'Tanzania, United Republic of']);
        $this->insert('{{%country}}', ['id' => '216', 'country_code' => 'TH', 'country_name' => 'Thailand']);
        $this->insert('{{%country}}', ['id' => '217', 'country_code' => 'TG', 'country_name' => 'Togo']);
        $this->insert('{{%country}}', ['id' => '218', 'country_code' => 'TK', 'country_name' => 'Tokelau']);
        $this->insert('{{%country}}', ['id' => '219', 'country_code' => 'TO', 'country_name' => 'Tonga']);
        $this->insert('{{%country}}', ['id' => '220', 'country_code' => 'TT', 'country_name' => 'Trinidad and Tobago']);
        $this->insert('{{%country}}', ['id' => '221', 'country_code' => 'TN', 'country_name' => 'Tunisia']);
        $this->insert('{{%country}}', ['id' => '222', 'country_code' => 'TR', 'country_name' => 'Turkey']);
        $this->insert('{{%country}}', ['id' => '223', 'country_code' => 'TM', 'country_name' => 'Turkmenistan']);
        $this->insert('{{%country}}', ['id' => '224', 'country_code' => 'TC', 'country_name' => 'Turks and Caicos Islands']);
        $this->insert('{{%country}}', ['id' => '225', 'country_code' => 'TV', 'country_name' => 'Tuvalu']);
        $this->insert('{{%country}}', ['id' => '226', 'country_code' => 'UG', 'country_name' => 'Uganda']);
        $this->insert('{{%country}}', ['id' => '227', 'country_code' => 'UA', 'country_name' => 'Ukraine']);
        $this->insert('{{%country}}', ['id' => '228', 'country_code' => 'AE', 'country_name' => 'United Arab Emirates']);
        $this->insert('{{%country}}', ['id' => '229', 'country_code' => 'GB', 'country_name' => 'United Kingdom']);
        $this->insert('{{%country}}', ['id' => '230', 'country_code' => 'US', 'country_name' => 'United States']);
        $this->insert('{{%country}}', ['id' => '231', 'country_code' => 'UM', 'country_name' => 'United States minor outlying islands']);
        $this->insert('{{%country}}', ['id' => '232', 'country_code' => 'UY', 'country_name' => 'Uruguay']);
        $this->insert('{{%country}}', ['id' => '233', 'country_code' => 'UZ', 'country_name' => 'Uzbekistan']);
        $this->insert('{{%country}}', ['id' => '234', 'country_code' => 'VU', 'country_name' => 'Vanuatu']);
        $this->insert('{{%country}}', ['id' => '235', 'country_code' => 'VA', 'country_name' => 'Vatican City State']);
        $this->insert('{{%country}}', ['id' => '236', 'country_code' => 'VE', 'country_name' => 'Venezuela']);
        $this->insert('{{%country}}', ['id' => '237', 'country_code' => 'VN', 'country_name' => 'Vietnam']);
        $this->insert('{{%country}}', ['id' => '238', 'country_code' => 'VG', 'country_name' => 'Virgin Islands (British)']);
        $this->insert('{{%country}}', ['id' => '239', 'country_code' => 'VI', 'country_name' => 'Virgin Islands (U.S.)']);
        $this->insert('{{%country}}', ['id' => '240', 'country_code' => 'WF', 'country_name' => 'Wallis and Futuna Islands']);
        $this->insert('{{%country}}', ['id' => '241', 'country_code' => 'EH', 'country_name' => 'Western Sahara']);
        $this->insert('{{%country}}', ['id' => '242', 'country_code' => 'YE', 'country_name' => 'Yemen']);
        $this->insert('{{%country}}', ['id' => '243', 'country_code' => 'YU', 'country_name' => 'Yugoslavia']);
        $this->insert('{{%country}}', ['id' => '244', 'country_code' => 'ZR', 'country_name' => 'Zaire']);
        $this->insert('{{%country}}', ['id' => '245', 'country_code' => 'ZM', 'country_name' => 'Zambia']);
        $this->insert('{{%message}}', ['id' => '1', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '2', 'id_message_type' => '2', 'message' => 'Please Help me i am in trouble', 'sent' => '2016-06-01 01:01:01']);
        $this->insert('{{%message}}', ['id' => '2', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '2', 'id_message_type' => '2', 'message' => 'Hurry up i am in danger', 'sent' => '2016-06-01 01:10:01']);
        $this->insert('{{%message}}', ['id' => '5', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '1', 'id_message_type' => '2', 'message' => 'We will call you as soon as possible', 'sent' => '2016-06-01 01:21:01']);
        $this->insert('{{%message}}', ['id' => '9', 'id_phone' => '+7968637380', 'id_case' => '6', 'id_sender_type' => '2', 'id_message_type' => '2', 'message' => 'Vamos canejo a ver que onda', 'sent' => '2016-07-14 17:23:37']);
        $this->insert('{{%message}}', ['id' => '10', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# we are going there to help you', 'sent' => '2016-07-19 17:35:15']);
        $this->insert('{{%message}}', ['id' => '11', 'id_phone' => '+447551524625', 'id_case' => '6', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#6# Ahi vamos a ayudarte no te preocupes', 'sent' => '2016-07-19 17:52:42']);
        $this->insert('{{%message}}', ['id' => '17', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# y estaria bueno que ande', 'sent' => '2016-07-20 15:54:00']);
        $this->insert('{{%message}}', ['id' => '18', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# otro', 'sent' => '2016-07-21 11:43:11']);
        $this->insert('{{%message}}', ['id' => '19', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# otro', 'sent' => '2016-07-21 11:43:58']);
        $this->insert('{{%message}}', ['id' => '20', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# aaaaaaaaaaaaaaaaaa', 'sent' => '2016-07-21 13:07:51']);
        $this->insert('{{%message}}', ['id' => '25', 'id_phone' => '+4475515246251', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# te mando esto nokia', 'sent' => '2016-07-21 16:22:22']);
        $this->insert('{{%message}}', ['id' => '26', 'id_phone' => '+4475515246251', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# te mando esto nokia', 'sent' => '2016-07-21 16:22:28']);
        $this->insert('{{%message}}', ['id' => '27', 'id_phone' => '+4475515246251', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# aaaaaaaaaaaaaaaaaaaaaa', 'sent' => '2016-07-21 16:23:33']);
        $this->insert('{{%message}}', ['id' => '28', 'id_phone' => '+4475515246251', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# bbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'sent' => '2016-07-21 16:26:13']);
        $this->insert('{{%message}}', ['id' => '29', 'id_phone' => '+4475515246251', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# cccccccccccccccccc', 'sent' => '2016-07-21 16:29:37']);
        $this->insert('{{%message}}', ['id' => '30', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# a ver ahora que onda gilazo', 'sent' => '2016-07-21 16:30:37']);
        $this->insert('{{%message}}', ['id' => '31', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# otro mas gilazo', 'sent' => '2016-07-21 16:32:45']);
        $this->insert('{{%message}}', ['id' => '32', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# maaaaaaaaaaaaaaaaaaaaaaas', 'sent' => '2016-07-21 16:36:10']);
        $this->insert('{{%message}}', ['id' => '33', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# bueno la ultima entonces', 'sent' => '2016-07-21 16:37:13']);
        $this->insert('{{%message}}', ['id' => '34', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# aaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'sent' => '2016-07-21 16:40:20']);
        $this->insert('{{%message}}', ['id' => '35', 'id_phone' => '+447551524625', 'id_case' => '1', 'id_sender_type' => '3', 'id_message_type' => '2', 'message' => 'case#1# zzzzzzzzzzzzzzzzzzzzzzzzz', 'sent' => '2016-07-21 16:42:40']);
        $this->insert('{{%message}}', ['id' => '38', 'id_phone' => '+447508849527', 'id_case' => '1', 'id_sender_type' => '2', 'id_message_type' => '2', 'message' => 'este es el mensajito', 'sent' => '2016-07-21 17:43:33']);
        $this->insert('{{%message_type}}', ['id' => '1', 'type' => 'phone']);
        $this->insert('{{%message_type}}', ['id' => '2', 'type' => 'sms']);
        $this->insert('{{%outcome_category}}', ['id' => '1', 'outcome' => 'Resolved']);
        $this->insert('{{%outcome_category}}', ['id' => '2', 'outcome' => 'Refered']);
        $this->insert('{{%outcome_category}}', ['id' => '3', 'outcome' => 'N/A']);
        $this->insert('{{%phone}}', ['id' => '+1160463036', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+2494225568', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+2647694543', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+2968035894', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+4387362913', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+447508849527', 'comment' => 'EE nokia phone to test client']);
        $this->insert('{{%phone}}', ['id' => '+4833319605', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+4929505151', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+5027810893', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+6593283133', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+7921464339', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+7944383683', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+7968637380', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+8234102891', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '+8730845923', 'comment' => 'added by system']);
        $this->insert('{{%phone}}', ['id' => '24234234', 'comment' => 'added by system']);
        $this->insert('{{%profile}}', ['user_id' => '1', 'name' => '', 'public_email' => '', 'gravatar_email' => 'info@open-ecommerce.org', 'gravatar_id' => 'e49de8ff6009a963195568839177e24d', 'location' => '', 'website' => '', 'bio' => '', 'id_country' => '1', 'availability' => '1', 'skills' => 'nada', 'firstname' => 'adminname', 'lastname' => 'adminsuraname', 'birthday' => '1966-07-16', 'avatar' => '', 'terms' => '0', 'phone' => '+4475515246251']);
        $this->insert('{{%profile}}', ['user_id' => '2', 'name' => 'Eduardo Helper', 'public_email' => 'eduardo@open-ecommerce.org', 'gravatar_email' => 'eduardo@open-ecommerce.org', 'gravatar_id' => '1f6df2c9dac05c886ac3f90e692f93af', 'location' => 'London', 'website' => 'http://www.open-ecommerce.org', 'bio' => 'Esto solo lo que quiero decir de mi', 'id_country' => '16', 'availability' => '1', 'skills' => 'eduardo adfasf', 'firstname' => 'Helper Eduardo', 'lastname' => 'Silva', 'birthday' => '2016-06-17', 'avatar' => '', 'terms' => '0', 'phone' => '+447551524625']);
        $this->insert('{{%profile}}', ['user_id' => '3', 'name' => '', 'public_email' => '', 'gravatar_email' => '', 'gravatar_id' => 'd41d8cd98f00b204e9800998ecf8427e', 'location' => '', 'website' => '', 'bio' => '', 'id_country' => '1', 'availability' => '1', 'skills' => 'esto', 'firstname' => 'Tester1', 'lastname' => 'ApellidoTester', 'birthday' => '2016-07-13', 'avatar' => '', 'terms' => '0', 'phone' => '']);
        $this->insert('{{%profile}}', ['user_id' => '4', 'name' => '', 'public_email' => '', 'gravatar_email' => '', 'gravatar_id' => '', 'location' => '', 'website' => '', 'bio' => '', 'id_country' => '', 'availability' => '1', 'skills' => 'Nada', 'firstname' => 'Pepe', 'lastname' => 'Marqueta', 'birthday' => '0000-00-00', 'avatar' => '', 'terms' => '0', 'phone' => '']);
        $this->insert('{{%profile}}', ['user_id' => '5', 'name' => '', 'public_email' => '', 'gravatar_email' => '', 'gravatar_id' => '', 'location' => '', 'website' => '', 'bio' => '', 'id_country' => '', 'availability' => '', 'skills' => '', 'firstname' => 'Juan', 'lastname' => 'Pitufo', 'birthday' => '0000-00-00', 'avatar' => '', 'terms' => '0', 'phone' => '']);
        $this->insert('{{%profile}}', ['user_id' => '6', 'name' => '', 'public_email' => '', 'gravatar_email' => '', 'gravatar_id' => '', 'location' => '', 'website' => '', 'bio' => '', 'id_country' => '', 'availability' => '', 'skills' => '', 'firstname' => 'Jackson', 'lastname' => 'Brown', 'birthday' => '0000-00-00', 'avatar' => '', 'terms' => '0', 'phone' => '']);
        $this->insert('{{%profile}}', ['user_id' => '7', 'name' => '', 'public_email' => '', 'gravatar_email' => '', 'gravatar_id' => '', 'location' => '', 'website' => '', 'bio' => '', 'id_country' => '', 'availability' => '', 'skills' => '', 'firstname' => 'Pepito', 'lastname' => 'cuevas', 'birthday' => '0000-00-00', 'avatar' => '', 'terms' => '0', 'phone' => '']);
        $this->insert('{{%profile}}', ['user_id' => '8', 'name' => '', 'public_email' => '', 'gravatar_email' => '', 'gravatar_id' => '', 'location' => '', 'website' => '', 'bio' => '', 'id_country' => '', 'availability' => '1', 'skills' => '', 'firstname' => 'pepe2', 'lastname' => 'Biondi', 'birthday' => '0000-00-00', 'avatar' => '', 'terms' => '0', 'phone' => '']);
        $this->insert('{{%qry_next_available_user}}', ['id' => '2', 'name' => 'Helper Eduardo']);
        $this->insert('{{%qry_next_available_user}}', ['id' => '4', 'name' => 'Pepe']);
        $this->insert('{{%sender_type}}', ['id' => '1', 'sender_type' => 'Automated Response']);
        $this->insert('{{%sender_type}}', ['id' => '2', 'sender_type' => 'Contact']);
        $this->insert('{{%sender_type}}', ['id' => '3', 'sender_type' => 'User']);
        $this->insert('{{%severity}}', ['id' => '1', 'severity' => 'Not Set', 'sla' => '']);
        $this->insert('{{%severity}}', ['id' => '2', 'severity' => 'Severity 1', 'sla' => 'Contact the client within 24hs']);
        $this->insert('{{%severity}}', ['id' => '3', 'severity' => 'Severity 2', 'sla' => 'about severity 2']);
        $this->insert('{{%text_template}}', ['id' => '1', 'name' => '001 generic helper answering', 'message' => 'This is an authomatic response from NNLS. We will contact you as soon we can.']);
        $this->insert('{{%text_template}}', ['id' => '2', 'name' => '002 generic helper not-answering', 'message' => 'This is an authomatic response from NNLS. We will contact you as soon a helper is available.']);
        $this->execute('SET foreign_key_checks = 1;');
    }

    public function down() {

        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `case_category`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `cases`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `contact`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `contact_phone`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `country`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `language_source`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `languages`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `message`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `message_type`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `outcome_category`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `phone`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `profile`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `qry_next_available_user`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `sender_type`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `severity`');
        $this->execute('SET foreign_key_checks = 1;');
        $this->execute('SET foreign_key_checks = 0');
        $this->execute('DROP TABLE IF EXISTS `text_template`');
        $this->execute('SET foreign_key_checks = 1;');





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
