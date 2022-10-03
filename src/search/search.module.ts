import { Module } from '@nestjs/common';
import { YoutubeModule } from '../youtube/youtube.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [YoutubeModule],
})
export class SearchModule {}
