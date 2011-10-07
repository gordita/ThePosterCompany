echo 'backup resources'
zip -r resources.backup.zip application/resource/

echo 'prepare to deploy'
mkdir -p ~/build_thepostercompany_project_temp;
mv application/resource ~/build_thepostercompany_project_temp/resource;
appcfg.py update application;
mv ~/build_thepostercompany_project_temp/resource application/resource;
echo 'Done!';