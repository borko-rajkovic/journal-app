import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('download')
export class DownloadController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  download(@Query() query: { path: string }, @Res() res: Response) {
    res.download(query.path);
  }
}
