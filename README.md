# Engineering Expo Website

This is the repository for the Engineering Expo website, a static site built with HTML, CSS, and JavaScript. The website is hosted on the utweb server.
Please if you have any questions or haven't learned how to use git before, read the following cheatsheet: https://education.github.com/git-cheat-sheet-education.pdf

## How to Gain Edit Access

If you would like to contribute to the Engineering Expo website, you will need to gain edit access to the repository on GitHub. To do this, please contact the project administrator (this is likely the pubweb lead) and request to be added as a collaborator. The lead will need to login through the github account using "utengrexpo". Once you have been added, you will be able to make changes to the codebase.

Make sure you create a personal access token in order to gain local access and commit to a development branch (not master!) Only once successful changes are made, a pull request should be made, and the live site updated by pulling from master.

On the utweb server, you may not be able to pull unless you update the .netrc file on your profile. Every user who wants to pull master and update live site must do this on the utweb server. When you are on the linux server through ssh, just paste the following command into the terminal: 
`echo "machine github.com login utengrexpo password <replace-with-personal-access-token>" > ~/.netrc`
and replace `<replace-with-personal-access-token>` with the real personal access token of utengrexpo for that year.

It's crucial that you try changes on your local machine first when developing, and not on the live site! Future pubweb leads, when adding collaborators (including yourself), make sure you only give access to change the non-master branch. Then make a pull request to master from the utengrexpo account on github.com, then finally from the utweb server, to make sure that we don't unintentionally push unecessary changes when trying out experimental layouts and designs. 

## Branches

The Engineering Expo website uses the following branches:

- `master`: This is the main branch of the repository. It contains the latest stable version of the website that is currently deployed on the server.
- `develop`: This branch is used for ongoing development work. Changes that are pushed to this branch are tested and integrated before being merged into the `master` branch.
- `feature-branch`: These branches are created when working on a specific feature or bugfix. When the work is complete, the branch is merged back into `develop`.

Checkout the following cheatsheet, underneath the branch section to figure out how to branch and make changes: https://education.github.com/git-cheat-sheet-education.pdf

## How to Make Meaningful Changes

When making changes to the Engineering Expo website, please ensure that your changes are meaningful and align with the goals of the project. Here are some guidelines to follow:

- Ensure that your changes are put into commits, which should be relatively meaninful ie, "updated service project page dates", etc
- Document your changes thoroughly in the commit message and pull request description.

## How to Commit Changes

When committing changes to the Engineering Expo website, please follow these steps:

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your changes based on `develop`.
3. Make your changes to the codebase.
4. Test your changes to ensure that they are working correctly.
5. Commit your changes with a meaningful commit message that describes what you changed.
6. Push your changes to your forked repository.
7. Open a pull request to merge your changes into the `develop` branch of the main repository.
8. Wait for feedback and address any issues that are raised during the review process.
9. Once your changes have been approved, they will be merged into the `develop` branch and deployed to the server.
10. Try to do git checkout "develop" on the livesite. If it looks good, then do a pull request to master and pull the master

## Conclusion

Hopefully, this readme has been helpful in guiding you through the process of contributing to the Engineering Expo website. If you have any questions or need further assistance, please do not hesitate to reach out to the pubweb lead or other members of the development team. If you're really, really stuck, trace an older pubweb lead. 

Good luck!
-A pubweb lead
