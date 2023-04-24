import {NgModule} from '@angular/core';

import {CommitIconComponent} from "./commitIcon.component";
import {FavoriteIconComponent} from "./favoriteIcon.component";
import {GearIconComponent} from "./gearIcon.component";
import {BookIconComponent} from "./bookIcon.component";
import {QuestionIconComponent} from "./questionIcon.component";
import {SmileIconComponent} from "./smileIcon.component";
import {DeleteIconComponent} from "./deleteIcon.component";
import {CloseIconComponent} from "./closeIcon.component";
import {BulbIconComponent} from "./bulbIcon.component";
import {CopyIconComponent} from "./copy.component";
import {RollBackIconComponent} from "./rollBackIcon.component";

const iconsList = [
    CommitIconComponent,
    FavoriteIconComponent,
    GearIconComponent,
    BookIconComponent,
    QuestionIconComponent,
    SmileIconComponent,
    DeleteIconComponent,
    CloseIconComponent,
    BulbIconComponent,
    CopyIconComponent,
    RollBackIconComponent
];

@NgModule({
    imports: [],
    exports: iconsList,
    declarations: iconsList,
    providers: [],
})
export class IconsModule {
}
