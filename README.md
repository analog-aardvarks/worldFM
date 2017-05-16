# Thesis Project
#### Table of Contents
- [Overview](#overview)
  - [Duration and Milestones](#duration-and-milestones)
  - [Design](#design)
- [Bare Minimum Requirements](#bare-minimum-requirements)
  - [Group Formation](#group-formation)
  - [Role Assignment](#role-assignment)
  - [Project Organization](#project-organization)
  - [Product Design](#product-design)
  - [Project Infrastructure](#project-infrastructure)
    - [Project Backlog](#project-backlog)
    - [Contribution Guide](#contribution-guide)
    - [Style Guide](#style-guide)
    - [Project Readme](#project-readme)
  - [Continuous Deployment](#continuous-deployment)
  - [Team Communication](#team-communication)
    - [New Code](#new-code)
    - [Speaking to each other](#speaking-to-each-other)
  - [Product Development](#product-development)
- [Advanced](#advanced)
  - [Testing and You](#testing-and-you)
  - [Misc.](#misc.)
- [Group Assignments](#group-assignments)


## Overview

### Duration and Milestones

The Thesis project begins on Week 8 Day 2 (Tuesday) and ends on Week 11 Day 5 (Friday). Your project must be feature __and__ code complete by the start of the day on Week 11 Day 2 (Tuesday).

You'll present you project to your cohort on Week 11 Day 5 (Friday) EOD.

### Design
This project is the natural expansion of previous projects where the objective is to learn the feel of rapid iteration and contiuous deployment. Far above the viability of the application as a 'product' or your team as a potential start-up.

In a real work environment, you'll rarely have the opportunity to choose all of the people you collaborate with. Your success as an engineer will, in large part, be determined by how well you're able to integrate with varied groups of engineers. The ability to contribute to a shared vision and iterate towards it effectively among peers is extremely valuable. This sprint will help you hone that skill.

Thesis Learning Objectives:
- project documentation
- product ideation and vision
- group dynamics and collaboration
- product implementation



During the thesis project, you must document your code, syntax styling, git workflow and feature roadmap in sufficient detail so that it can be handed to an arbitrary team with virtually no explanation.

This repo contains templates that you'll use as a guide to successfully document and structure your project on github. As you begin your project, you'll copy over the templates into a brand-new repo (public) you'll create as part of the process described below __--DON'T DO THAT YET__ (follow the steps).

## Bare Minumum Requirements

#### Group Formation
- [ ] Get into your assigned groups (end of this document)
- Each member should spend five minutes (no talking) answering the following questions:
  - [ ] What are my 2 greatest technical strengths?
  - [ ] What are my 2 greatest technical challenges?
  - [ ] What are my personal goals for this project?
- [ ] Discuss your answers with your group. Get to know each other.
- [ ] Begin brainstorming with your group about ideas in prep for the afternoon lecture.

### Role Assignment
Read [this article](https://www.atlassian.com/agile/scrum) for an overview of scrum roles.
As a group, decide which team members will fulfill each of the three core scrum roles.
  - [ ] [Product Owner][2]
  - [ ] [Scrum Master][3]
  - [ ] [Development Team][4]
  - [ ] Fill out the Team section in the readme with this info.

### Project Organization
Each team has a totally awesome codename. You'll use it on GitHub and in your documentation until you choose a real name for your group. Don't worry about picking it at this point (that's why I gave you codenames). Changing it later will be relatively easy and you'll likely refactor it several times after that anyway.
  - [ ] The Scrum Master must [Create a new GitHub Organization account](https://help.github.com/articles/creating-a-new-organization-account) for your team using your codename. Using a GitHub org ensures that all members share equally in the glory of the project.
  - [ ] Add all your team-mates as members to the new org.
  - [ ] Create a new project repo (same name as the org) in your new org
    - so you'll have a something like [spacekitten/spacekitten](https://github.com/spacekitten/spacekitten)

### Product Design
Create product vision by drafting a 'Project Summary'
  - [ ] Copy `_PRESS-RELEASE.md` into the root directory of your own project repo and complete the exercise described therein. Note that the actual instructions are hidden in a comment block. You'll need to view the raw file, not the rendered markdown version to see them.
  - [ ] Use github issues
  - [ ] Create a detailed mock up for every view in your application.
    - Tools
        - Pen and Paper / White Board
        - [Framebox](http://framebox.org/AAyRf)
        - [Pencil Project](http://pencil.evolus.vn/Downloads.html)
        - [Gliffy](https://www.gliffy.com/)
        - [MockPro](https://www.mockflow.com/)
  - [ ] Create a flow chart mapping the interaction of data
    ![ ](http://sepp.io/wp-content/uploads/2013/11/diagram.png)
        
        


### Project Infrastructure
In order to support your current team _and_ future contributers to your project, you'll need to document your project as you build it. It should be the case that, without any intervention or additional explanation from you, the next team of collaborators  (or yourself in six months) can dive in and figure out how to start hacking easily.

Document your project and codebase to the point that if you decide to push it to hacker-news, anyone with a solid understanding of JavaScript can (after reviewing your documentation and comments) start submitting pull requests. Plan on not having any face-to-face interaction with the next team of collaborators. The most effective and efficient way to accomplish this is to do it right from the very start. Don't wait till the last minute. That will never work.
  - [ ] Heavily comment all aspects of your code.

#### Project Backlog

Be sure keep your project backlog (using github issues) up to date. There should be clear
documentation of tasks completed (github provides this functionality automatically) and
next steps/features in your project backlog so that your collaborators can just dive right in.

You should use github issues to track both your project's backlog of tasks and
fixes and to provide a way to track future goals. You can use labels to
organize issues and milestones to group issues together and to visualize your
progress.

You may want to take advantage of a tool like [waffle.io](https://waffle.io) to manage github
issues with a more powerful interface and can provide a kanban-board-like place to manage your
project and workflow.

#### Contribution Guide

- [ ] Document your team's git workflow by copying `_CONTRIBUTING.md` into the root directory of your repo and editing it to suite your needs. It follows a [forking workflow](https://www.atlassian.com/git/workflows#!workflow-forking).

The provided `_CONTRIBUTING.md` advocates for a `git rebase` based workflow
instead of a `git merge` based workflow. The advantage of a `rebase` based
workflow over `merge` is that a rebase, even one which fixes conflicts, does
not introduce a new commit into your history. If you use `merge` and there are
any conflicts, then you will get a new "merge commit" in your history. Over
time, you can accrue hundreds of merge commits which can make your history
significantly harder to read and introduce a much lower signal to noise ratio
in your history. `rebase` avoids these problems by changing existing commits
instead of creating a new one.

Because `rebase` changes commits, you will have to push with the `-f` or
`--force` flag to your branch after rebasing, as the history has changed in a
way that git cannot resolve. You should _never_ rebase or push with force to
the `master` branch of your repository, as that will invalidate everyone elses
clones and checkouts of the repository.

Though it advocates for a slightly different version of the rebase workflow, the article, [A romance of a single dimension: linear git history in practice](http://www.thumbtack.com/engineering/linear-git-history/) does an excelent job of justifying the practice. I strongly recomend reading it, even if you choose a different option.

##### Example Workflow Diagram

![](http://i.imgur.com/p0e4tQK.png)

Remember, you're welcome to use which ever git workflow you want, `_CONTRIBUTING.md` is provided here as a suggestion (with the intention of you editing it). But whichever workflow you choose, you must document it well, you __must__ be consistent, and you should always have someone other than the person who wrote the code review it before it's merged into the central repository.

#### Style Guide
- [ ] Document your team's style guide by copying `_STYLE-GUIDE.md` into the root directory of your repo. `_STYLE-GUIDE.md` is provided as a template, you should edit it to reflect your agreed upon setup.
  - [AirBnB's](https://github.com/airbnb/javascript) and [The Google JS Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml) are also excellent examples.

#### Project Readme
Your project readme is the very first thing that users will see when they view your github project. It's the portal that must link to the other content files in the root of your repo.
- [ ] Use `_README.md` as a template to create a thorough readme.
  - It must link to the documentation you've created (as described by the items above).

### Continuous Deployment
You must have a deployed website setup.
- [ ] Configure automatic deployment of your master branch

### Team Communication

#### New Code

Your team should communicate new ideas for features or report important bugs
through github issues or whatever tool you use to manage github issues, that
way everyone on your project can see what important things are happening and
there is always a repository of further work to be done.

To introduce new code into your project, your team should _always_ make pull
requests - never make commits and push directly to master. After you make a
pull request, at least one other member of your team should do a thorough code
review of the changes and you should have a good back and forth where the code
is refactored and improved before being merged in. This will guarantee a higher
degree of code quality and will prevent careless errors from being merged into
your application.
- [ ] Read this excellent (and brief) [article about pull requests](https://github.com/blog/1124-how-we-use-pull-requests-to-build-github)

With continuous integration, you will benefit even more from a
pull request based workflow because you will always know that you are never
merging breaking code into your master branch.

#### Speaking to each other

You may want to use a persistent chat service like [hipchat](5), [slack](6), or irc to
communicate as a team so that you can have efficient asynchronous
communication. This will make your team more accountable and efficient, so you
don't have to stop everyone else's work to discuss small issues or request code
review.

### Product Development
- [ ] Create a simple home page for your project.
  - If you're not sure where to start, checkout using GitHub pages. It's free, robust, and can easily be personalized to your own domain.
  - [ ] Make the landing page a salesman's dream (clear, flashy, cool design, etc)! Templates are your friends!
- [ ] Add a sweet "Made at Hack Reactor" Banner with this simple script:

  ```javascript
  $('body').append(
    '<a href="http://hackreactor.com"> \
    <img style="position: fixed; top: 0; right: 0; border: 0;" \
    src="http://i.imgur.com/x86kKmF.png" \
    alt="Built at Hack Reactor"> \
    </a>'
  );
  ```

## Presentation
###Planning
Planning is a critical part of success. You don't want all the effort you have put forth to miss it's chance to shine. Follow these steps to get your presentation started on the right foot.

- [ ] Two hours before presentation time stop all development or bug fixes. 
- [ ] Create a script starting with the problem, moving to the solution and describing your tech stack
- [ ] Refine the script to create a narrative, imagine your ideal user and walk through it with them

###Practice
Even if practice does not always make perfect, it does always make it better. Run through the presentation with your group and make adjustments when needed.

- [ ] Imagine you are in front of your peers. Consider this your dress rehearsal, take it seriously.
- [ ] Tweak your script to make it go as smoothly as possible, don't leave things until you are up there. Now is the time to refine and improve your pitch.

###Present
This is it! The big show. Keep in mind that this is your chance to make a good impression. Imagine yourself in front of investors, your best foot forward.

- [ ] Target length 2-3 minutes
- [ ] Be prepared to answer a few questions after about your approach and stack choice
- [ ] When you are finished give the other groups the same courtesy and respect you wanted while it was your turn

## Advanced

### Testing

Use TDD.

Test driven development is not valuable because it catches errors, but because it changes the way you think about interfaces between modules. Writing tests before you write code influences how you think about the process. It provides a safety net for performing refactoring and it documents the expected behavior of the system.

Implement _all_ of the following:
  - [ ] Include testing when defining your project scope
  - [ ] Continuous integration to run all tests on commit
    - You can use any CI system you like, TravisCI (easy) or Circle-CI (med) or Jenkins (hard) are all options
  - [ ] Make testing part of daily standups
  - [ ] Discuss testing during mentor check-ins

Implement 2-3 of the following:
  - [ ] Unit testing on the client
  - [ ] Unit testing on the server side
  - [ ] Integration testing for your API and database
  - [ ] End-to-end testing for your main workflows
  - [ ] Code coverage reports for unit tests
  - [ ] Visual testing for your app’s look and feel

### Misc.
- [ ] Create a screencast demo of the product and share on landing page
- [ ] Write a technical blog post
- [ ] Run usability tests, collect user feedback and simplify UI



<!-- LINKS -->

[1]:http://en.wikipedia.org/wiki/Scrum_(software_development)#Roles
[2]:http://en.wikipedia.org/wiki/Scrum_(software_development)#Product_Owner
[3]:http://en.wikipedia.org/wiki/Scrum_(software_development)#Scrum_Master
[4]:http://en.wikipedia.org/wiki/Scrum_(software_development)#Development_Team
[5]:https://www.hipchat.com/
[6]:https://slack.com/


there is always a repository of further work to be done.

To introduce new code into your project, your team should _always_ make pull
requests - never make commits and push directly to master. After you make a
pull request, at least one other member of your team should do a thorough code
review of the changes and you should have a good back and forth where the code
is refactored and improved before being merged in. This will guarantee a higher
degree of code quality and will prevent careless errors from being merged into
your application.
- [ ] Read this excellent (and brief) [article about pull requests](https://github.com/blog/1124-how-we-use-pull-requests-to-build-github)

With continuous integration, you will benefit even more from a
pull request based workflow because you will always know that you are never
merging breaking code into your master branch.

#### Speaking to each other

You may want to use a persistent chat service like [hipchat](5), [slack](6), or irc to
communicate as a team so that you can have efficient asynchronous
communication. This will make your team more accountable and efficient, so you
don't have to stop everyone else's work to discuss small issues or request code
review.

### Product Development
- [ ] Create a simple home page for your project.
  - If you're not sure where to start, checkout using GitHub pages. It's free, robust, and can easily be personalized to your own domain.
  - [ ] Make the landing page a salesman's dream (clear, flashy, cool design, etc)! Templates are your friends!
- [ ] Add a sweet "Made at Hack Reactor" Banner with this simple script:

  ```javascript
  $('body').append(
    '<a href="http://hackreactor.com"> \
    <img style="position: fixed; top: 0; right: 0; border: 0;" \
    src="http://i.imgur.com/x86kKmF.png" \
    alt="Built at Hack Reactor"> \
    </a>'
  );
  ```

## Presentation
### Planning
Planning is a critical part of success. You don't want all the effort you have put forth to miss it's chance to shine. Follow these steps to get your presentation started on the right foot.

- [ ] Two hours before presentation time stop all development or bug fixes. 
- [ ] Create a script starting with the problem, moving to the solution and describing your tech stack
- [ ] Refine the script to create a narrative, imagine your ideal user and walk through it with them

### Practice
Even if practice does not always make perfect, it does always make it better. Run through the presentation with your group and make adjustments when needed.

- [ ] Imagine you are in front of your peers. Consider this your dress rehearsal, take it seriously.
- [ ] Tweak your script to make it go as smoothly as possible, don't leave things until you are up there. Now is the time to refine and improve your pitch.

### Present
This is it! The big show. Keep in mind that this is your chance to make a good impression. Imagine yourself in front of investors, your best foot forward.

- [ ] Target length 2-3 minutes
- [ ] Be prepared to answer a few questions after about your approach and stack choice
- [ ] When you are finished give the other groups the same courtesy and respect you wanted while it was your turn

## Advanced

### Testing

Use TDD.

Test driven development is not valuable because it catches errors, but because it changes the way you think about interfaces between modules. Writing tests before you write code influences how you think about the process. It provides a safety net for performing refactoring and it documents the expected behavior of the system.

Implement _all_ of the following:
  - [ ] Include testing when defining your project scope
  - [ ] Continuous integration to run all tests on commit
    - You can use any CI system you like, TravisCI (easy) or Circle-CI (med) or Jenkins (hard) are all options
  - [ ] Make testing part of daily standups
  - [ ] Discuss testing during mentor check-ins

Implement 2-3 of the following:
  - [ ] Unit testing on the client
  - [ ] Unit testing on the server side
  - [ ] Integration testing for your API and database
  - [ ] End-to-end testing for your main workflows
  - [ ] Code coverage reports for unit tests
  - [ ] Visual testing for your app’s look and feel

### Misc.
- [ ] Create a screencast demo of the product and share on landing page
- [ ] Write a technical blog post
- [ ] Run usability tests, collect user feedback and simplify UI



<!-- LINKS -->

[1]:http://en.wikipedia.org/wiki/Scrum_(software_development)#Roles
[2]:http://en.wikipedia.org/wiki/Scrum_(software_development)#Product_Owner
[3]:http://en.wikipedia.org/wiki/Scrum_(software_development)#Scrum_Master
[4]:http://en.wikipedia.org/wiki/Scrum_(software_development)#Development_Team
[5]:https://www.hipchat.com/
[6]:https://slack.com/
