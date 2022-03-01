// @ts-check

// Github의 레포지토리 관리 CLI를 만들어본다
// 이슈, 풀 리퀘스트 등의 라벨 관리
// node src/main.js list-bugs check-prs

// .env 파일로 프로젝트 환경변수로 사용하게 하는 라이브러리
require('dotenv').config()

const { GITHUB_ACCESS_TOKEN } = process.env

const fs = require('fs')
const { program } = require('commander')
const { Octokit } = require('octokit')
const prompts = require('prompts')
const chalk = require('chalk')

program.version('0.0.1')

const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN })

const OWNER = 'hiseungjun2'
const REPO = 'studyNodejs'

const LABEL_TOO_BIG = 'too-big'

program
  .command('me')
  .description('Check my profile')
  .action(async () => {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated()
    console.log('Hello, %s', login)
  })

program
  .command('list-bugs')
  .description('List issues with bug label')
  .action(async () => {
    const result = await octokit.rest.issues.listForRepo({
      owner: OWNER,
      repo: REPO,
      labels: 'bug', // label 필터링 가능
    })

    const issueWithBugLabel = result.data.filter(
      (issue) =>
        // @ts-ignore
        issue.labels.find((label) => label.name === 'bug') !== undefined
    )

    const output = issueWithBugLabel.map((issue) => ({
      title: issue.title,
      number: issue.number,
    }))

    console.log(output)
    console.log('List bugs!')
  })

// 풀 리퀘스트를 모두 검사해서, 만약 너무 diff 가 큰 (100줄) 풀 리퀘스트가 있으면
// 'too-bog' 이라는 레이블을 붙인다
program
  .command('check-prs')
  .description('Check pull request status')
  .action(async () => {
    const result = await octokit.rest.pulls.list({
      owner: OWNER,
      repo: REPO,
    })

    const prsWithDiff = await Promise.all(
      result.data.map(async (pr) => ({
        labels: pr.labels,
        number: pr.number,
        compare: await octokit.rest.repos.compareCommits({
          owner: OWNER,
          repo: REPO,
          base: pr.base.ref,
          head: pr.head.ref,
        }),
      }))
    )

    await Promise.all(
      prsWithDiff
        .map(({ compare, ...rest }) => {
          const totalChanges = compare.data.files?.reduce(
            (sum, file) => sum + file.changes,
            0
          )
          return {
            compare,
            ...rest,
            totalChanges,
          }
        })
        .filter(
          (pr) =>
            pr && typeof pr.totalChanges === 'number' && pr.totalChanges > 100
        )
        .map(async ({ labels, number, totalChanges }) => {
          if (!labels.find((label) => label.name === LABEL_TOO_BIG)) {
            console.log(
              chalk.greenBright(
                `Adding ${LABEL_TOO_BIG} label to PR: ${number}...`
              )
            )
            const response = await prompts({
              type: 'confirm',
              name: 'shouldContiune',
              message: `Do you really want to add label ${LABEL_TOO_BIG} to PR #${number}`,
            })

            if (response.shouldContiune) {
              return octokit.rest.issues.addLabels({
                owner: OWNER,
                repo: REPO,
                issue_number: number,
                labels: [LABEL_TOO_BIG],
              })
            }
            console.log('Cancelled!')
          }
          return undefined
        })
    )

    console.log(chalk.greenBright('Check prs!'))
  })

program.parseAsync()
