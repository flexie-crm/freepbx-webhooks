## **Integrate Flexie CRM with FreePBX**

> You can use this code for any CRM integration, using WebHooks, from the events listener you can send to any endpoint you'd like. 

This code would help you integrate FreePBX call logging and missed calls into Flexie CRM without any need to change FreePBX core modules or doing anything fancy.

It's a very simple approach by connecting to Asterisk Manager (the VoIP engine used by FreePBX) and listen for events in real time.

## Step 1

Login in your FreePBX and add a user for Asterisk Manager which would have only Read Permissions.

> **Settings** -> **Asterisk Manager Users**
>
> Permit connections only from localhost, which is 127.0.0.1/255.255.255.0 as a default value

![Add Asterisk User Manager](https://flexie-static.s3.amazonaws.com/github-images/step-1.png "Asterisk User Manager")

## Step 2

Login as root in your hosted FreePBX Linux box, then in asterisk console enable Asterisk CDR manager module, so you can read CDR (call logs) event in real time

> ssh root@your-freepbx-box

before loading the module, check if the configuration file exits for this module, if not you should create cdr_manager.conf in /etc/asterisk folder

> [root@freepbx ~]# touch /etc/asterisk/cdr_manager.conf

Then opnen this file with your preferred command line editor (vim or nano or whatever) and put the following into that file:

```
[general]
enabled = yes
```

Then you can enter asterisk console and enable the module

> [root@freepbx ~]# asterisk -rvvvvvvvvv

> freepbx*CLI> module load cdr_manager.so

Now you should be ready to listen to real time events from Asterisk.

## Step 3

While in your FreePBX command line terminal, create a folder in /opt so you can clone this repository there

> [root@freepbx ~]# mkdir /opt/flexie

> [root@freepbx ~]# cd /opt/flexie

You should install git if your FreePBX box does not already have it installed

> [root@freepbx ~]# yum install git

> [root@freepbx ~]# git clone https://github.com/flexie-crm/freepbx-webhooks .

Then you need to install dependences

> [root@freepbx ~]# npm install

## Step 4

After creating the Asterisk Manager user from the step one, put those credentials in the config.js file (from the files you cloned on this repository), specifically in the asterisk_user and asterisk_pass keys

```
{
    ...
    asterisk_user: 'Your User',
    asterisk_pass: 'Your Pass',
    ...
}
```

Also add the other values in the config.js file. Each config value has a description in comments on that file.

## Step 5

In order to have this a running process in your FreePBX box you should install PM2 node js package, which is needed to keep the process alive all the time and start it automatically even if you reboot the system.

> [root@freepbx ~]# npm install -g pm2

After installing pm2 you are ready to start your listener process

> [root@freepbx ~]# pm2 start init.js --name="Flexie CRM Listener"

## Step 6

After completing the above 5 steps, there is another step in order to push recordings URL in Flexie call logs.

In your FreePBX admin panel, navigate in Advanced Settings.

> **Settings** -> **Advanced Settings**

From there, there are 2 options you have to switch from No to Yes

- Display Readonly Settings
- Override Readonly Settings

After submitting this change, find the option **Post Call Recording Script**

On that option you should set the folloing value

> /opt/flexie/recording.js --call-id=^{UNIQUEID} --rec-year=^{YEAR} --rec-month=^{MONTH} --rec-day=^{DAY} --rec-filename=^{CALLFILENAME}.^{MIXMON_FORMAT}

Submit changes, then Apply Config (red button top right)

Now you are ready to get all call logs in your Flexie CRM, from there Flexie would take care of mapping each log to records you have like your customers/contacts, leads or any other records.

If you are in the contact center industry/business, this approach of getting logs is very practical, so you can send these logs anywhere, not just in Flexie CRM, but in any other CRM or system you use.

Also feel free to update/upgrade your FreePBX as it won't affect the logs listener you'r using.