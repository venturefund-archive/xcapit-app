#!/bin/bash
#

VERSION_KEY="tag"
TEMP_DIR="tmp"
FORK_APP_REPO="app"
YAML_FILE="nonprod/app/values.yaml"
FRONTEND_K8_VALUES_REPO="xcpt-frontend-k8s-values"

set_tmp_directory() {
    if [ -d "$TEMP_DIR" ]; then
        delete_tmp_dir
    fi
    mkdir $TEMP_DIR
    cd $TEMP_DIR || exit
}

set_work_directory() {
    WORK_DIR=$(dirname "$0")
    cd "$WORK_DIR" || exit
    set_tmp_directory
}

delete_tmp_dir() {
    rm -rf "$TEMP_DIR"
}

last_nonprod_app_version() {
    git clone git@gitlab.com:xcapit/xcapit-foss-fork/app.git $FORK_APP_REPO
    cd $FORK_APP_REPO || exit
    git checkout develop > /dev/null
    echo "$(git describe --tags)"
}

current_nonprod_version() {
    git clone git@gitlab.com:xcapit/infra/xcpt-frontend-k8s-values.git $FRONTEND_K8_VALUES_REPO
    cd $FRONTEND_K8_VALUES_REPO || exit
    grep "$VERSION_KEY:" "$YAML_FILE" | cut -d ':' -f 2 | tr -d ' '
}

update_version() {
    cd $FRONTEND_K8_VALUES_REPO || exit
    sed -i '' "s/\($VERSION_KEY:\).*/\1 $LAST_VERSION/" "$YAML_FILE"
}

create_branch() {
    BRANCH_NAME="chore/deploy-nonprod-app-$LAST_VERSION"
    git checkout -b "$BRANCH_NAME"
}

commit_changes() {
    git add "$YAML_FILE"
    COMMIT_MSG="chore: Deploy nonprod app $LAST_VERSION"
    git commit -m "$COMMIT_MSG"
}

push_branch() {
    git push --set-upstream origin "$BRANCH_NAME"
}

set_work_directory
LAST_VERSION=$(last_nonprod_app_version)
CURRENT_VERSION=$(current_nonprod_version)

echo "Current Version: $CURRENT_VERSION"
echo "Last Version: $LAST_VERSION"

if [ "$CURRENT_VERSION" = "$LAST_VERSION" ]; then
    echo "The nonprod app is up to date version $CURRENT_NONPROD_VERSION"
else
    echo "Updating to $LAST_VERSION"

    update_version
    create_branch
    commit_changes
    push_branch

    echo "The branch to update to $LAST_VERSION was pushed"
fi

cd ../..
delete_tmp_dir
